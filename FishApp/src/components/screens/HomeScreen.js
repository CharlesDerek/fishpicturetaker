import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import firebase from 'react-native-firebase';
import { MenuButton, MenuIcon } from '../Common';
import { LogoTitle } from '../LogoTitle';
import { getDeveloperMode } from '../../lib/storage';

export default class HomeScreen extends Component {
  static navigationOptions = {
    headerTitle: <LogoTitle />
  };

  state = { developerMode: false };

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    firebase.analytics().setCurrentScreen("Home");
    this.setState({ developerMode: await getDeveloperMode() });
  }

  render() {
		const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <ScrollView style={{ width: "100%" }}>
          <MenuButton title="Identify Fish" icon={<MenuIcon name="questioncircleo" />} onPress={() => navigate("IdentifyFish")} />
          <MenuButton title="Look Up Fish" icon={<MenuIcon name="search1" />} onPress={() => navigate("List")} />
          <MenuButton title="Feedback" icon={<MenuIcon name="message1" />} onPress={() => navigate("Feedback")} />
          <MenuButton title="About Fishpic" onPress={() => navigate("About")} />
          {this.state.developerMode && <MenuButton title="Developer Menu" onPress={() => navigate("Developer")} />}
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
