import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
} from 'react-native';
import firebase from 'react-native-firebase';
import * as EmailValidator from 'email-validator';
import { Button, YesNoButtonGroup, ButtonGroup } from './Common';
import Styles, { TEXT_COLOUR } from '../Styles';
import { sendFeedback } from '../lib/api';
import Loader from './Loader';

export default class FeedbackContainer extends Component {
  static enjoymentButtons = ["Not Really", "Yes!"];

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      errorMessage: null,
      resultMessage: null,
      enjoyment: null,
      tellMeAboutYourExperience: null,
      contactPermitted: false
    };
  }

  handleFieldChange = (name, value) => {
    const errorMessage = this.validateField(name, value);
    const newState = { errorMessage };
    newState[name] = value;
    this.setState(newState);
  }

  validateField = (name, value) => {
    const requiredEmailMessage = "Email is required.";
    switch (name) {
      case "contactPermitted":
        return value ? requiredEmailMessage : null;
      case "emailAddress":
      {
        if (value === "") {
          return requiredEmailMessage;
        }
        return EmailValidator.validate(value) ? null : "Invalid email.";
      }
      default:
        return null;
    }
  }

  handleFormSubmit = async () => {
    await this.performAsyncAction(this.sendFeedbackToApi);
  }

  sendFeedbackToApi = async () => {
    const { loading, errorMessage, resultMessage, contactPermitted, ...fields } = this.state;
    await sendFeedback(fields);
    this.setState({ resultMessage: "Thank you for your feedback." });
  }

  performAsyncAction = async (asyncAction) => {
    this.setState({ loading: true });
    try {
      await asyncAction();
    } catch (e) {
      if (e.message === "Network request failed") {
        this.setState({ resultMessage: "There is no Internet connection. Please try again later."});
      } else {
        this.setState({ resultMessage: "There was an error." });
        console.warn(e.message)
        firebase.crashlytics().recordError(0, e.message);
      }
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const textStyle = { fontSize: 20, color: TEXT_COLOUR, marginBottom: 10 };
    if (this.state.loading) {
      return <Loader />;
    } else if (this.state.resultMessage) {
      return <View style={Styles.container}><Text style={textStyle}>{this.state.resultMessage}</Text></View>;
    } else {
      const numberOfLines = 5;
      const fontSize = 18;
      return (
        <View style={Styles.container}>
          <ScrollView style={{ width: "100%" }}>
            <Text style={textStyle}>Enjoying Fishpic?</Text>
            <ButtonGroup
              name="enjoyment"
              buttons={FeedbackContainer.enjoymentButtons}
              selectedButton={this.state.enjoyment}
              onPress={this.handleFieldChange}
            />
            {this.state.enjoyment && <>
              <Text style={textStyle}>Tell me about your experience...</Text>
              <TextInput
                style={Styles.textInput}
                multiline={true}
                numberOfLines={numberOfLines}
                minHeight={numberOfLines * fontSize}
                title="experience"
                onChangeText={this.handleFieldChange.bind(this, "tellMeAboutYourExperience")}
                maxLength={2000}
                value={this.tellMeAboutYourExperience}
              />
              <Text style={textStyle}>Can I contact you about your feedback?</Text>
              <YesNoButtonGroup
                name="contactPermitted"
                value={this.state.contactPermitted}
                onPress={this.handleFieldChange}
              />
              {this.state.contactPermitted &&
                <TextInput
                  onChangeText={this.handleFieldChange.bind(this, "emailAddress")}
                  style={Styles.textInput}
                  placeholder="Your email address"
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  maxLength={256}
                />}
              {this.state.errorMessage && <Text style={{ color: "#F00", marginBottom: 20 }}>{this.state.errorMessage}</Text>}
              <Button title="Submit" onPress={this.handleFormSubmit} disabled={this.state.errorMessage !== null} />
            </>}
          </ScrollView>
        </View>
      );
    }
  }
}
