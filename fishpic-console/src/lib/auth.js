import { Auth } from 'aws-amplify';

export const getUserId = async () => {
    const userSession = await Auth.currentSession();
    if (userSession === null || !userSession.isValid()) {
        return null;
    } else {
        return userSession.getAccessToken().decodePayload().sub;
    }
}