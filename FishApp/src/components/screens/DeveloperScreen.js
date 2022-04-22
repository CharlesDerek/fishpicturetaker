import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import firebase from 'react-native-firebase';
import { MenuButton } from '../Common';
import { setEulaVersion, setShareImagesSetting, setDeveloperMode } from '../../lib/storage';
import FishpicPackage from '../../lib/FishpicPackage';

export default class DeveloperScreen extends Component {
  static navigationOptions = {
    title: 'Developer'
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
		firebase.analytics().setCurrentScreen("Developer");
  }

  async handleResetEula() {
    await setEulaVersion(null);
  }

  async handleResetShareImageSetting() {
    await setShareImagesSetting(null);
  }

  async handleRunClassifierTests() {
    const results = await FishpicPackage.Classifier.runTests();
    console.log("Benchmark best results:")
    console.log(results)
    Toast.show(results, Toast.LONG);
  }

  async handleDisableDeveloperMode() {
    await setDeveloperMode(false);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={{ width: "100%" }}>
          <MenuButton title="Reset EULA" onPress={this.handleResetEula} />
          <MenuButton title="Reset Share Image Setting" onPress={this.handleResetShareImageSetting} />
          <MenuButton title="Run Classifier Tests" onPress={this.handleRunClassifierTests} />
          <MenuButton title="Disable Developer Mode" onPress={this.handleDisableDeveloperMode} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: '#F5FCFF',
    padding: 20
  },
});
