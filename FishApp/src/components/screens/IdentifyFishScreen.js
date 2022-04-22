import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  Platform
} from 'react-native';
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-picker';
import RNGRP from 'react-native-get-real-path';
import firebase from 'react-native-firebase';
import { logEvent } from '../../utils';
import FishpicPackage from '../../lib/FishpicPackage';
import { getFishData } from '../../lib/Data';
import { uploadOrSaveImage } from '../../lib/ImageUpload';
import { MenuButton, MenuIcon } from '../Common';
import { processClassifierResults } from '../../lib/Classifier';
import Styles from '../../Styles';
import { incrementNumberOfImagesClassified } from '../../lib/storage';
import Loader from '../Loader';

export default class IdentifyFishScreen extends Component {
  static navigationOptions = {
    title: 'Identify Fish'
  };

  // Documentation: https://github.com/react-native-community/react-native-image-picker/blob/master/docs/Reference.md#options
  static imagePickerOptions = {
    noData: true,
    storageOptions: {
      skipBackup: true
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentDidMount() {
		firebase.analytics().setCurrentScreen("IdentifyFish");
  }

  openImageAndClassify = () => {
    ImagePicker.launchImageLibrary(IdentifyFishScreen.imagePickerOptions, this.imagePickerHandler(false));
  }

  takePhotoAndClassify = () => {
    ImagePicker.launchCamera(IdentifyFishScreen.imagePickerOptions, this.imagePickerHandler(true));
  }

  imagePickerHandler = photoCreatedInApp => async (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.error('ImagePicker Error: ', response.error);
    } else {
      this.setState({ loading: true });
      if (photoCreatedInApp) {
        logEvent("takePhotoAndClassify");
      } else {
        logEvent("openImageAndClassify");
      }
      await incrementNumberOfImagesClassified();

      const path = Platform.Os === 'android' ? await RNGRP.getRealPathFromURI(response.uri) : response.uri;
      try {
        console.log("Classifying: " + path);
        const classificationData = await FishpicPackage.Classifier.classify(path);
        this.displayResultsAndUploadImage(photoCreatedInApp, classificationData);
      } catch (e) {
        const message = "Classifier Module error: " + e;
        console.error(message); 
        Toast.show("Image classification error.", Toast.LONG);
      } finally {
        // Add a handler to the end of the event queue to turn off the Loader so that this Screen won't be accidentally rendered for a split
        // second before transition to the next screen.
        setTimeout(() => {
          this.setState({ loading: false });
        });
      }
    }
  }

  displayResultsAndUploadImage = (photoCreatedInApp, classificationData) => {
    if (classificationData === null) {
			throw new Error("No classification results were returned.");
    } else if (classificationData.results.length === 0) {
      Toast.show("Unable to identify contents of photo.", Toast.LONG);
			logEvent("Unable to identify contents of photo.");
    } else {
      const { imageUri, results } = classificationData;
      console.log("Image URI: " + imageUri);
      console.log(results);
      const processedResults = processClassifierResults(results);
      const fishes = processedResults.filter(x => x !== null);
      if (fishes.length !== 0) {
        // Don't wait for this async fn.
        uploadOrSaveImage(photoCreatedInApp, imageUri, results)
          .catch(err => console.error(err));
      }

      if (fishes.length === 0) {
        Toast.show("There are no fish in this photo.", Toast.LONG);
				logEvent("There are no fish in this photo.");
      } else if (processedResults.length === 1) {
        const fish = getFishData(processedResults[0].class);
        this.props.navigation.navigate("Fish", { fish: fish, isResult: true });
      } else {
        this.props.navigation.navigate("Results", { fishes: fishes });
      }
    }
  }

  render() {
    if (this.state.loading) {
      return <Loader />;
    } else {
      return (
        <View style={Styles.container}>
          <ScrollView style={{ width: "100%" }}>
            <Text>
              Fishpic identifies fish species using your camera. It does not need an Internet connection to identiy fish. Please note that Fishpic only supports species native to Queensland, Australia.{"\n"}{"\n"}
              Here are some tips to ensure that Fishpic correctly identifies your fish:{"\n"}{"\n"}
              Ensure that the photo contains only one fish.{"\n"}{"\n"}
              Make sure that the fish is horizontal facing to the left or the right.{"\n"}{"\n"}
            </Text>
          </ScrollView>
          <View style={{ position: "absolute", bottom: 0, margin: 20, width: "100%" }}>
            <MenuButton title="Take Photo" icon={<MenuIcon name="camera" />} onPress={this.takePhotoAndClassify} />
            <MenuButton title="Choose Photo From Gallery" icon={<MenuIcon name="picture" />} onPress={this.openImageAndClassify} />
          </View>
        </View>
      );
    }
  }
}
