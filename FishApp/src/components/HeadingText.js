import React from 'react';
import {
  Text,
  View
} from 'react-native';

export default function HeadingText(props){
  return (
      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#414141" }} { ...props } />
      </View>
  );
}
