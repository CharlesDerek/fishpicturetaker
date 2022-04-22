import { getAppVersion } from '../utils';
import { getDeveloperMode, getUsageStatistics, getEulaVersion } from './storage';
const { Auth, API, Storage } = require('aws-amplify');

const REGION = 'ap-southeast-2';
const IDENTITY_POOL_ID = 'ap-southeast-2:61901957-cee8-4070-a2c1-5bb483e8f187';

Auth.configure({
  identityPoolId: IDENTITY_POOL_ID,
  region: REGION,
  identityPoolRegion: REGION,
  userPoolId: 'ap-southeast-2_zfGhL33lh',
  userPoolWebClientId: "4cb3pr2mheoakb4brnl59i07sl",
  mandatorySignIn: false,
});

Storage.configure({
  region: REGION,
  bucket: "fishpic-images",
  identityPoolId: IDENTITY_POOL_ID 
});

/*
API.configure({
  endpoints: [
    {
      name: "fishpicApi",
      endpoint: "https://api.fishpic.app/v1",
      region: REGION,
      custom_header: async () => {
        //return { Authorization: (await Auth.currentSession()).idToken.jwtToken };
        return { 'x-key': '8j9qBtqG7R3hDfbrVDNR97hFpqbMg3FzxTYJNe8DNTLXnuxSK' };
      }
    },
    {
      name: "fishpicImagesApi",
      endpoint: "https://files.fishpic.app/v1",
      region: REGION,
      custom_header: async () => {
        return { Authorization: (await Auth.currentSession()).idToken.jwtToken };
      }
    }
  ]  
});
*/

const apiEndpoint = "https://api.fishpic.app/v1";
//const apiEndpoint = "http://10.0.2.2:3000";

const postGraphQl = async (query, variables) => {
  // This is very poor security since somebody could hack the apk file and extract the key, but it's better than nothing.
  const key = 'T8j9qBtqG7R3hDfbrVDNR97hFpqbMg3FzxTYJNe8DNTLXnuxSK';
  const options = { method: "POST", headers: { 'x-key': key }, body: JSON.stringify({ query, variables}) };
  const res = await fetch(apiEndpoint + "/graphql", options);
  const { errors } = await res.json();
  if (errors !== undefined) {
    throw new Error(`postGraphQL error: query: ${query} variables: ${variables} errors: ` + JSON.stringify(errors));
  }
};

async function uploadImageToStorage(fileName, contents) {
  const stored = await Storage.put(fileName, contents, {
    level: 'private',
    contentType: "image/jpeg"
  });
  console.log("Uploaded image to storage: " + JSON.stringify(stored));
  return stored.key;
};

export const uploadImage = async (data) => {
  const key = await uploadImageToStorage(data.fileName, data.contents);
  const imageData = {
    identityId: await getIdentityId(),
    key,
    uploadedDate: data.uploadedDate,
    classificationResults: data.results,
    createdInApp: data.createdInApp,
    isTestData: await getDeveloperMode(),
    eulaVersion: await getEulaVersion(),
    imageModel: data.imageModel,
    deviceModel: data.deviceModel,
    appVersion: getAppVersion()
  };
  try {
    await postGraphQl(
      "mutation createImage($image: image!) { createImage(image: $image) }",
      { image: imageData }
    );
    return true;
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

export const getIdentityId = async () => {
  return (await Auth.currentCredentials()).data.IdentityId;
};

export const sendFeedback = async (fields) => {
  const identityId = await getIdentityId();
  const appVersion = getAppVersion();
  const usageStatistics = await getUsageStatistics();
  const developerMode = await getDeveloperMode();
  const feedback = { identityId, appVersion, usageStatistics, isTestData: developerMode, fields };
  await postGraphQl(
    "mutation createFeedback($feedback: feedback!) { createFeedback(feedback: $feedback) }",
    { feedback }
  );
};