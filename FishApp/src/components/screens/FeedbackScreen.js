import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import FeedbackContainer from '../FeedbackContainer';

export default class FeedbackScreen extends Component {
  static navigationOptions = {
    title: 'Feedback'
  };

  static enjoymentButtons = ["Not Really", "Yes!"];

  componentDidMount() {
    firebase.analytics().setCurrentScreen(FeedbackScreen.navigationOptions.title);
  }

  render() {
    return <FeedbackContainer />;
  }
}
