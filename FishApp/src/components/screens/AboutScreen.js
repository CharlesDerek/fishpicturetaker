import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import HeadingText from '../HeadingText';
import fishProfileImages from "../../../assets/fish_profile_images.json";
import { setDeveloperMode } from '../../lib/storage';
import { TEXT_COLOUR } from '../../Styles';

export default class AboutScreen extends Component {
  static navigationOptions = {
    title: 'About Fishpic'
  };

  constructor(props) {
    super(props);
    this.state = { numberOfTitlePresses: 0 };
  }

  handleTitlePress = async () => {
    const numberOfTitlePresses = this.state.numberOfTitlePresses + 1;
    this.setState({ numberOfTitlePresses: numberOfTitlePresses });
    console.log("Title press");
    const numberOfPressesToActivateDeveloperMode = 5;
    if (numberOfTitlePresses == numberOfPressesToActivateDeveloperMode) {
      await setDeveloperMode(true);
      Toast.show("Developer mode activated.", Toast.LONG);
    }
  }

  render() {
    const attributions = fishProfileImages
      .filter(x => x.licenseCode !== null && x.licenseCode !== "Public Domain")
      .map(x => <Text key={x.imageUrl} style={styles.text}>{`${x.attribution} ${x.imageUrl}. ${x.licenseUrl}\n`}</Text>);
    return (
      <View style={styles.container}>
        <ScrollView>
          <HeadingText onPress={this.handleTitlePress}>About Fishpic</HeadingText>
          <Text style={styles.text}>
            Fishpic was created by Sandstorm Software.
          </Text>
          <HeadingText>Attributions</HeadingText>
          <Text style={styles.text}>
            The following images were used in this app. All images had their backgrounds removed and were cropped. Some were mirrored, rotated and colour corrected:{"\n"}
          </Text>
          {attributions}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  text: {
    color: TEXT_COLOUR,
    marginBottom: 5,
  },
});
