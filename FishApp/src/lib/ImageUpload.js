import { NetInfo } from 'react-native';
import RNFS from "react-native-fs";
import DeviceInfo from 'react-native-device-info';
import ImageResizer from 'react-native-image-resizer';
import { Buffer } from 'buffer';
import uuid from 'uuid';
import {
  getShareImagesSetting,
  setShareImagesSetting,
  addToImagesToUpload,
  getImagesToUpload,
  removeImageFromImagesToUpload,
  addToUploadedImageUris,
  getUploadedImageUris
} from './storage';
import { uploadImage as apiUploadImage } from './api';
import { getExifMetadata } from '../utils/Image';

export async function uploadOrSaveImage(photoCreatedInApp, imageUri, results) {
  if (await getShareImagesSetting() === true) {
    const uploadedImageUris = await getUploadedImageUris();
    if (new Set(uploadedImageUris).has(imageUri)) {
      console.log("Image has already been uploaded: " + imageUri);
      return;
    }

    const imageModel = (await getExifMetadata(imageUri)).Model || null;
    const deviceModel = DeviceInfo.getModel();
    const image = { uri: imageUri, results: results, createdInApp: photoCreatedInApp, uploadedDate: new Date(), imageModel, deviceModel };
    if (await uploadImage(image)) {
      addToUploadedImageUris(imageUri);
      console.log("Successfully uploaded image: " + imageUri);
    } else {
      await addToImagesToUpload(image);
      console.log("Saved image: " + imageUri);
    }
  }
}

export async function uploadSavedImages() {
  if (await NetInfo.isConnected.fetch() && await getShareImagesSetting() === true) {
    console.log("uploadSavedImages started");
    const images = await getImagesToUpload();
    await Promise.all(images.map(uploadAndThenRemoveImage));
    console.log("uploadSavedImages finished");
  }
}

async function uploadAndThenRemoveImage(data) {
  if (await uploadImage(data)) {
    if (!await removeImageFromImagesToUpload(data)) {
      console.warn("Image does not exist in imagesToUpload: " + JSON.stringify(data));
    }
  }
}

async function uploadImage(data) {
  if (!await RNFS.exists(data.uri)) {
    console.warn("Image does not exist: " + data.uri);
    return true;
  } else if (await NetInfo.isConnected.fetch()) {
    try {
      const uri = data.uri;
      console.log(`Resizing ${uri}`);
      const maxSize = 1920; // The max width of profile images of 1334px with an extra ~40% buffer.
      var resizedResults = await ImageResizer.createResizedImage(uri, maxSize, maxSize, "JPEG", 90);
      console.log(`Resized URI ${resizedResults.uri} with size ${resizedResults.size}`);
      const fileName = uuid.v4() + ".jpg";
      console.log('Reading resized file');
      const contents = new Buffer(await RNFS.readFile(resizedResults.uri, 'base64'), 'base64');
      console.log('Uploading image to API');
      return await apiUploadImage({ ... data, contents, fileName });
    } catch (e) {
      console.warn(e);
    }
  }
  return false;
}

async function clearSavedImages() {
  const images = await getImagesToUpload();
  images.forEach(async image => {
    await removeImageFromImagesToUpload(image);
  });
}

const test = false;
if (test) {
  setShareImagesSetting(true);

  clearSavedImages();

  uploadImage({ uri: "file:///storage/emulated/0/Android/data/com.fishapp/files/Pictures/CapturedImage1993846783094349334.jpg", fileName: "test1.jpg", uploadedDate: new Date(), createdInApp: true  });
}

// Run the uploadSavedImages asynchronously on start up.
uploadSavedImages().then(x => x).catch(err => console.warn(err));