import Exif from 'react-native-exif'

export const getExifMetadata = async (imageUri) => {
  return (await Exif.getExif(imageUri)).exif;
}