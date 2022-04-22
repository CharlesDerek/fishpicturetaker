import fetch from 'node-fetch';
import base64url from "base64url";
import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";

const region = "ap-southeast-2";
const userpoolId = "ap-southeast-2_zfGhL33lh";
const appClientId = "4cb3pr2mheoakb4brnl59i07sl";
const identityPoolId = 'ap-southeast-2:61901957-cee8-4070-a2c1-5bb483e8f187';

export const validateAuthorizationHeader = async (headerValue, groupName = null) => {
    const prefix = "Bearer ";
    if (headerValue.startsWith(prefix)) {
        const token = headerValue.substring(prefix.length);
        const tokenPayload = await validateToken(token);
		if (groupName !== null && tokenPayload["cognito:groups"].find(x => x === groupName) === undefined) {
			throw new Error(`User is not in the ${groupName} group.`);
        }
        return tokenPayload.sub; // sub is the userId
    } else {
        throw new Error("Authorization header does not contain a Bearer token.");
    }
}

const validateToken = async token => {
    const { kid, alg } = getTokenHeader(token);
    // TODO: cache this in global memory to speed things up.
    const publicKey = await getUserPoolPublicKey(userpoolId, region, kid);
    const payload = jwt.verify(token, jwkToPem(publicKey), { algorithms: [ alg ] });
    const { exp, aud, token_use, iss } = payload;
    const expiryDate = new Date(0);
    expiryDate.setUTCSeconds(exp);
    if (expiryDate <= new Date()) {
        throw new Error("Token has expired.");
    }
    // Access tokens don't have an aud field for some reason.
    if (aud !== undefined && aud !== appClientId) {
        throw new Error("Token audience is incorrect.");
    }
    if (token_use !== "access") {
        throw new Error("Token is not an access token.");
    }
    if (iss !== `https://cognito-idp.${region}.amazonaws.com/${userpoolId}`) {
        throw new Error("Token Issuer is incorrect.");
    }
    return payload;
}

const getTokenHeader = token => {
    const nParts = 3;
    const parts = token.split(".");
    if (parts.length !== nParts) {
        throw new Error("Token does not have expected number of parts.");
    }
    const headerPartIndex = 0;
    return JSON.parse(base64url.decode(parts[headerPartIndex]));
}

const getUserPoolPublicKey = async (userpoolId, region, keyId) => {
    const url = `https://cognito-idp.${region}.amazonaws.com/${userpoolId}/.well-known/jwks.json`;
    const response = await fetch(url);
    const data = await response.json();
    const keyObject = data.keys.find(x => x.kid === keyId);
    //return keyObject === null ? null : keyObject.n;
    return keyObject;
}