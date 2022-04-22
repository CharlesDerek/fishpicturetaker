import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
} from 'react-native';
import { logEvent } from '../utils';
import Modal from "react-native-modal";
import { Button } from './Common';
import { CheckBox } from 'react-native-elements';
import { setShareImagesSetting, getShareImagesSetting } from '../lib/storage';
import { Anchor, ModalContainer } from './Common';
import { sharedImagesUrl } from '../Constants';
import { PRIMARY_BLUE } from '../Styles';

export class ImagePermissionsModalContainer extends ModalContainer {
  constructor(props, modalIsVisible = false) {
    super(props, modalIsVisible);
  }

  async conditionallyDisplayModal() {
    if (await getShareImagesSetting() === null) {
      const showTimeInMilliseconds = 5000;
      this.delayShowModal(showTimeInMilliseconds);
    }
  } 

  render() {
    return <ImagePermissionsModal isVisible={this.state.modalIsVisible} onClose={this.modalCloseHandler} />
  }
}

export class ImagePermissionsModal extends Component {
  state = { checkboxChecked: true };

  constructor(props) {
    super(props);
    getShareImagesSetting().then(shareImages => {
      console.log("Current ShareImages setting: " + shareImages);
    });
  }

  checkBoxPressHandler = () => {
    this.setState({ checkboxChecked: !this.state.checkboxChecked });
  } 

  buttonPressHandler = async () => {
    await setShareImagesSetting(this.state.checkboxChecked);
    logEvent("ImagePermissions", { permissionGiven: this.state.checkboxChecked.toString() });
    this.props.onClose();
  }

  render() {
    const headerStyles = {
      fontWeight: "bold",
      fontSize: 20,
      color: "black",
      textAlign: "center",
      marginBottom: 5
    };
    const textStyles = {
      marginTop: 5,
      marginBottom: 5,
    };
    const modalStyles = {
      backgroundColor: "#FAFAFA",
      borderRadius: 10,
      padding: 20,
      position: "relative"
    };
    const buttonContainerStyles = {
      marginLeft: 0,
      marginRight: 0,
      marginTop: 10,
    };
    const privacyPolicyUrl = "https://htmlpreview.github.io/?https://gist.githubusercontent.com/ashleyjsands/f1c25ce213431abd476d395939bf5a8c/raw#SharedImages";
    return (
      <Modal style={modalStyles} isVisible={this.props.isVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          <Text style={headerStyles}>Help improve Fishpic?</Text>
          <ScrollView>
            <Text style={textStyles}>Would you like to help us improve the quality of identified images?</Text>
            <Text style={textStyles}>Sharing your images with us will help improve the neural network that ids the fish in your images.</Text>
            <Text style={textStyles}>Some shared images of fish may be used within Fishpic in the Fish information screen.</Text>
            <Text style={textStyles}>We will <Text style={{ fontWeight: "bold" }}>not</Text> share your image with anybody else. We only use shared images to improve Fishpic.</Text>
            <Text style={textStyles}>For more information, please read the <Anchor href={privacyPolicyUrl}>Privacy Policy</Anchor>.</Text>
            <Anchor href={sharedImagesUrl} text="More Details" styles={textStyles} />
          </ScrollView>
          {PermissionCheckBox(this.state.checkboxChecked, this.checkBoxPressHandler)}
          <Button
            title="OK"
            onPress={this.buttonPressHandler}
            buttonStyle={{ backgroundColor: PRIMARY_BLUE }}
            containerViewStyle={buttonContainerStyles}
          />
        </View>
      </Modal>
    );
  }
}

function PermissionCheckBox(checked, pressHandler) {
  return (
    <CheckBox 
      title="I would like to privately share my photos to improve Fishpic."
      checked={checked}
      onPress={pressHandler}
      containerStyle={{ marginLeft: 0, marginRight: 0 }}
    />
  );
}