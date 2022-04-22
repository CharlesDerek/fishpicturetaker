import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  BackHandler
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { setEulaVersion, getEulaVersion } from '../../lib/storage';
import { logEvent } from '../../utils';
import { Button, Anchor } from '../Common';
import { LogoTitle } from '../LogoTitle';
import { PRIMARY_BLUE, PRIMARY_GREY } from '../../Styles';
import HeadingText from '../HeadingText';

const currentEulaVersion = 0.1;

export default class EulaScreen extends Component {
  static navigationOptions = {
    headerTitle: <LogoTitle />
  };

  constructor(props) {
    super(props);
    this.state = { visible: false };

    getEulaVersion().then(eulaVersion => {
      if (eulaVersion === currentEulaVersion) {
        this.navigateToHomeScreen();
      } else {
        this.setState({ visible: true });
      }
    })
  }

  declineHandler = () => {
    logEvent("EULA", { accepted: false });
    BackHandler.exitApp()
  }

  acceptHandler = async () => {
    await setEulaVersion(currentEulaVersion);
    logEvent("EULA", { accepted: true });
    this.navigateToHomeScreen();
  }

  navigateToHomeScreen() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: "Home" })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    if (this.state.visible) {
      const eulaUrl = "https://htmlpreview.github.io/?https://gist.githubusercontent.com/ashleyjsands/f2e1c9b753b2cc712d8f7645c19a3244/raw";
      const styles = StyleSheet.create({
        container: {
          flex: 1,
        },
      });
      const footerStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: "absolute",
        bottom: 0,
        width: "100%"
      };
      const buttoViewStyle = {
        flex: 1,
        width: "100%"
      };
      const commonStyle = {  marginLeft: 0, marginRight: 0 };
      const buttonStyle = { backgroundColor: PRIMARY_BLUE, height: 60 };
      const fm = 20; // Footer Margin
      return (
        <View style={styles.container}>
          <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}>
            <HeadingText>End User License Agreeement</HeadingText>
            <Text style={{ fontSize: 20 }}>Please read the <Anchor href={eulaUrl}>EULA</Anchor>. Do you accept it?</Text>
          </View>
          <View style={footerStyle}>
            <View style={{...buttoViewStyle, marginLeft: fm, marginRight: fm / 2, marginBottom: fm }}>
              <Button title="I Decline" onPress={this.declineHandler} containerViewStyle={{ ...commonStyle, marginRight: 0 }} buttonStyle={{ ...buttonStyle, backgroundColor: PRIMARY_GREY }} />
            </View>
            <View style={{...buttoViewStyle, marginLeft: fm / 2, marginRight: fm, marginBottom: fm }}>
              <Button title="I Accept" onPress={this.acceptHandler} containerViewStyle={{ ...commonStyle, marginLeft: 0 }} buttonStyle={{ ...buttonStyle, backgroundColor: PRIMARY_BLUE }} />
            </View>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }
}