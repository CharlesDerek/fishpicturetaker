import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';

export function logEvent(message, data) {
  console.log(message + (data === undefined ? "" : ":" + data));
  const regex = /[^a-zA-Z]+/gm;
  const firebaseParameterNameLength = 30;
  const eventName = message.replace(regex, "_").replace(/_+$/gm, "");
  firebase.analytics().logEvent(eventName, data);
}

export const getAppVersion = () => {
  return DeviceInfo.getVersion();
}

export const isNullOrUndefined = value => {
  return value === null || value === undefined;
}