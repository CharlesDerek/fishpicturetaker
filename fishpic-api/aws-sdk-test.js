/*
MIT License

Copyright (c) 2017 Anomaly Innovations

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var packageJson = require("./package.json");

var AWS = require("aws-sdk");
var AWSCognito = require("amazon-cognito-identity-js");
var apigClientFactory = require("aws-api-gateway-client").default;
var WindowMock = require("window-mock").default;

global.window = { localStorage: new WindowMock().localStorage };
global.navigator = function() {
  return null;
};

const fetch = require("node-fetch"); // Used to fix a bug in Auth.signUp
global.fetch = function() {
  console.log("f: " + JSON.stringify(arguments));
  return fetch.apply(null, arguments);
}

const argv = {
	"username": 'ashley.j.sands@gmail.com',
	"password": 'ashley.j.sands@gmail.com',
	"userPoolId": 'ap-southeast-2_zfGhL33lh',
	"appClientId": '4cb3pr2mheoakb4brnl59i07sl',
	"cognitoRegion": 'ap-southeast-2',
	"identityPoolId": 'ap-southeast-2:61901957-cee8-4070-a2c1-5bb483e8f187',
	"invokeUrl": 'https://api.fishpic.app/v1',
	"apiGatewayRegion": 'ap-southeast-2',
	"pathTemplate": '/graphql',
	"method": 'GET',
	"additionalParams": '{"headers":{"Accept":"applicaton/json"},"queryParams":{"query":"{images{Id}}"}}',
};

function authenticate(callback) {
  var poolData = {
    UserPoolId: argv.userPoolId,
    ClientId: argv.appClientId
  };

  AWS.config.update({ region: argv.cognitoRegion });
  var userPool = new AWSCognito.CognitoUserPool(poolData);

  var userData = {
    Username: argv.username,
    Pool: userPool
  };
  var authenticationData = {
    Username: argv.username,
    Password: argv.password
  };
  var authenticationDetails = new AWSCognito.AuthenticationDetails(
    authenticationData
  );

  var cognitoUser = new AWSCognito.CognitoUser(userData);

  console.log("Authenticating with User Pool");

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function(result) {
      callback({
        idToken: result.getIdToken().getJwtToken(),
        accessToken: result.getAccessToken().getJwtToken()
      });
    },
    onFailure: function(err) {
      console.log(err.message ? err.message : err);
    },
    newPasswordRequired: function() {
      console.log("Given user needs to set a new password");
    },
    mfaRequired: function() {
      console.log("MFA is not currently supported");
    },
    customChallenge: function() {
      console.log("Custom challenge is not currently supported");
    }
  });
}

function getCredentials(userTokens, callback) {
  console.log("Getting temporary credentials");

  var logins = {};
  var idToken = userTokens.idToken;
  var accessToken = userTokens.accessToken;

  logins[
    "cognito-idp." + argv.cognitoRegion + ".amazonaws.com/" + argv.userPoolId
  ] = idToken;

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: argv.identityPoolId,
    Logins: logins
  });

  AWS.config.credentials.get(function(err) {
    if (err) {
      console.log(err.message ? err.message : err);
      return;
    }

    callback(userTokens);
  });
}

function makeRequest(userTokens) {
  console.log("Making API request");

  var apigClient = apigClientFactory.newClient({
    apiKey: argv.apiKey,
    accessKey: AWS.config.credentials.accessKeyId,
    secretKey: AWS.config.credentials.secretAccessKey,
    sessionToken: AWS.config.credentials.sessionToken,
    region: argv.apiGatewayRegion,
    invokeUrl: argv.invokeUrl
  });

	const params = {};
  var additionalParams = JSON.parse(argv.additionalParams);
  var body = {} || JSON.parse(argv.body);

  if (argv.accessTokenHeader) {
    const tokenHeader = {};
    tokenHeader[argv.accessTokenHeader] = userTokens.accessToken;
    additionalParams.headers = Object.assign({}, additionalParams.headers, tokenHeader);
  }

  apigClient
    .invokeApi(params, argv.pathTemplate, argv.method, additionalParams, body)
    .then(function(result) {
      console.dir({
        status: result.status,
        statusText: result.statusText,
        data: result.data
      });
    })
    .catch(function(result) {
      if (result.response) {
        console.dir({
          status: result.response.status,
          statusText: result.response.statusText,
          data: result.response.data
        });
      } else {
        console.log(result.message);
      }
    });
}

function makeUnauthRequest(userTokens) {
  console.log("Making API request");

  var apigClient = apigClientFactory.newClient({
/*
    apiKey: argv.apiKey,
    accessKey: AWS.config.credentials.accessKeyId,
    secretKey: AWS.config.credentials.secretAccessKey,
    sessionToken: AWS.config.credentials.sessionToken,
*/
    region: argv.apiGatewayRegion,
    invokeUrl: argv.invokeUrl
  });

	const params = {};
  var additionalParams = JSON.parse(argv.additionalParams);
  var body = {} || JSON.parse(argv.body);

  if (argv.accessTokenHeader) {
    const tokenHeader = {};
    //tokenHeader[argv.accessTokenHeader] = userTokens.accessToken;
    additionalParams.headers = Object.assign({}, additionalParams.headers, tokenHeader);
  }

  apigClient
    .invokeApi(params, argv.pathTemplate, argv.method, additionalParams, body)
    .then(function(result) {
      console.dir({
        status: result.status,
        statusText: result.statusText,
        data: result.data
      });
    })
    .catch(function(result) {
      if (result.response) {
        console.dir({
          status: result.response.status,
          statusText: result.response.statusText,
          data: result.response.data
        });
      } else {
        console.log(result.message);
      }
    });
}

/*
authenticate(function(tokens) {
  getCredentials(tokens, makeRequest);
});
*/


makeUnauthRequest();
