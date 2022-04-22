import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';

export class LogoTitle extends Component {
    render() {
      return (
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <Image source={require("../../assets/images/small_logo.png")} style={{ width: 50, height: 50, resizeMode: "contain", marginLeft: 16 }} />
          <Text style={{ color: "#1A1A1A", fontSize: 20, marginLeft: 8, fontWeight: "500" }}>Fishpic</Text>
        </View>
      );
    }
  }