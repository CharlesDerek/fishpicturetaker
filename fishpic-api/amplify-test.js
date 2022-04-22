const { Auth, API, Storage } = require('aws-amplify');
global.fetch = require("node-fetch"); // Used to fix a bug in Auth.signUp
const fetch = require("node-fetch"); // Used to fix a bug in Auth.signUp
global.fetch = function() {
  console.log("f: " + JSON.stringify(arguments));
  return fetch.apply(null, arguments);
}


const REGION = 'ap-southeast-2';
const IDENTITY_POOL_ID = 'ap-southeast-2:61901957-cee8-4070-a2c1-5bb483e8f187';

Auth.configure({
  identityPoolId: IDENTITY_POOL_ID,

  // REQUIRED - Amazon Cognito Region
  region: REGION,

  // OPTIONAL - Amazon Cognito Federated Identity Pool Region 
  // Required only if it's different from Amazon Cognito Region
  identityPoolRegion: REGION,

  // OPTIONAL - Amazon Cognito User Pool ID
  userPoolId: 'ap-southeast-2_zfGhL33lh',

  // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
  //userPoolWebClientId: 'a1b2c3d4e5f6g7h8i9j0k1l2m3',
  userPoolWebClientId: "4cb3pr2mheoakb4brnl59i07sl",

  // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
  mandatorySignIn: false,

  /*
  // OPTIONAL - Configuration for cookie storage
  cookieStorage: {
  // REQUIRED - Cookie domain (only required if cookieStorage is provided)
      domain: '.yourdomain.com',
  // OPTIONAL - Cookie path
      path: '/',
  // OPTIONAL - Cookie expiration in days
      expires: 365,
  // OPTIONAL - Cookie secure flag
      secure: true
  },
  */

  // OPTIONAL - customized storage object
  //storage: new MyStorage(),

  // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
  //authenticationFlowType: 'USER_PASSWORD_AUTH'
});

Storage.configure({
  region: REGION,
  bucket: "fishpic-images",
  identityPoolId: IDENTITY_POOL_ID 
});


const username = "ashley.j.sands+2@gmail.com";
const password = username;

API.configure({
  endpoints: [
    {
      name: "fishpicApi",
      //endpoint: "https://api.fishpic.app/v1",
      region: REGION,
      endpoint: "https://9qkfdinvx1.execute-api.ap-southeast-2.amazonaws.com/prod/",
      custom_header: async () => {
        return { Authorization: (await Auth.currentSession()).idToken.jwtToken };
      }
    },
    {
      name: "fishpicImagesApi",
      endpoint: "https://files.fishpic.app/v1",
      region: REGION,
      custom_header: async () => {
        return { 'x-api-key': 'Ld0c8pXlC56aJGqpGhmlx8QdJf1ijK5M8UKXomKp' };
      }
    }
  ]  
});

const getGraphQl = async () => {
  try {
    const init = {
      queryStringParameters: { query: "{images{Id}}" },
      header: { Authorization: (await Auth.currentSession()).idToken.jwtToken }
    };
    const x = await API.get("fishpicApi", "graphql", init);
    console.dir(x);
    console.log("success");
  } catch (e) {
    console.error("graphql request failed: " + e);
  }
};

const uploadImage = async () => {
  try {
    const init = {
      body: "test1"
    };
    const x = await API.put("fishpicImagesApi", "private/testuser1", init);
    console.dir(x);
    const y = await API.put("fishpicImagesApi", "private/testuser1/123.jpg", init);
    console.dir(y);
    console.log("success");
  } catch (e) {
    console.error("uploadImage request failed: " + e);
  }
};

(async function() {
  console.log((await Auth.currentCredentials()).data.IdentityId);
  var x = await Storage.vault.get("c179c94d-e985-49f5-92b3-bbf79669601d.jpg");
  console.log(x);
  //await uploadImage();
  const stored = await Storage.vault.put("testFileName.jpg", "test1", {
    contentType: "image/jpeg"
  });
  console.log("Uploaded: " + stored.key);
})();

if (false) {
  Auth.signIn(username, password)
    .then(async user => {
      //console.log("user signed in: " + JSON.stringify(user));
      //console.log("session: " + JSON.stringify(await Auth.currentSession()));
      //console.log("current user info: " + JSON.stringify(await Auth.currentUserInfo()));
      
      //const stored = await Storage.vault.put("testFileName.jpg", "test1", {
        //contentType: "image/jpeg"
      //});
      //console.log(stored.key);

      await getGraphQl();
    })
    .catch(err => console.error(err));
}