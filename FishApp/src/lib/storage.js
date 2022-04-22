import { AsyncStorage } from 'react-native';

const keys = {
  developerMode: "developerMode",
  eulaVersion: "eulaVersion",
  username: "username",
  password: "password",
  shareImages: "shareImages",
  imagesToUpload: "imagesToUpload",
  uploadedImageUris: "uploadedImageUris",
  numberOfImagesClassified: "numberOfImagesClassified",
  totalUsageTimeInSeconds: "totalUsageTimeInSeconds"
};

export async function setDeveloperMode(developerMode) {
  await AsyncStorage.setItem(keys.developerMode, JSON.stringify(developerMode));
}

export async function getDeveloperMode() {
  return await get(keys.developerMode) || false;
}

export async function setEulaVersion(eulaVersion) {
  await AsyncStorage.setItem(keys.eulaVersion, JSON.stringify(eulaVersion));
}

export async function getEulaVersion() {
  return await get(keys.eulaVersion);
}

export async function setShareImagesSetting(shareImages) {
  await AsyncStorage.setItem(keys.shareImages, JSON.stringify(shareImages));
}

export async function getShareImagesSetting() {
  return await get(keys.shareImages);
}

export async function addToImagesToUpload(image) {
  const images = await getImagesToUpload();
  images.push(image);
  await setImagesToUpload(images);
}

export async function getImagesToUpload() {
  const value = await AsyncStorage.getItem(keys.imagesToUpload);
  return value === null ? [] : JSON.parse(value);
}

export async function removeImageFromImagesToUpload(image) {
  const images = await getImagesToUpload();
  const newImages = images.filter(x => x.uri !== image.uri);
  await setImagesToUpload(newImages);
  return images.length > newImages.length;
}

export async function addToUploadedImageUris(imageUri) {
  const imageUris = new Set(await getUploadedImageUris());
  imageUris.add(imageUri);
  await AsyncStorage.setItem(keys.uploadedImageUris, JSON.stringify(Array.from(imageUris)));
}

export async function getUploadedImageUris() {
  const value = await AsyncStorage.getItem(keys.uploadedImageUris);
  return value === null ? [] : JSON.parse(value);
}

async function setImagesToUpload(images) {
  await AsyncStorage.setItem(keys.imagesToUpload, JSON.stringify(images));
}

export async function getUsageStatistics() {
  const totalUsageTimeInSeconds = await getTotalUsageTimeInSeconds();
  const numberOfImagesClassified = await getNumberOfImagesClassified();
  return {
    totalUsageTimeInSeconds,
    numberOfImagesClassified
  };
}

export async function getNumberOfImagesClassified() {
  return await getNumber(keys.numberOfImagesClassified);
}

export async function incrementNumberOfImagesClassified() {
  const number = await incrementItem(keys.numberOfImagesClassified);
  console.log("Number of images classified: " + number);
}

export async function addToTotalUsageTimeInSeconds(time) {
  return await addToItem(keys.totalUsageTimeInSeconds, time);
}

export async function getTotalUsageTimeInSeconds() {
  return await getNumber(keys.totalUsageTimeInSeconds);
}

async function incrementItem(key) {
  return await addToItem(key, 1);
}

export async function addToItem(key, value) {
  const number = await getNumber(key);
  const newNumber = number + value;
  await AsyncStorage.setItem(key, JSON.stringify(newNumber));
  return newNumber;
}

async function getNumber(key) {
  const value = await get(key);
  return value === null ? 0 : value;
}

async function getArray(key) {
  const value = await get(key);
  return value === null ? [] : value;
}

async function get(key) {
  const value = await AsyncStorage.getItem(key);
  return value === null ? null : JSON.parse(value);
}