import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
} from 'react-native';
import { logEvent } from '../../utils';
import { ListItem } from '../Common';
import { getFishThumbnail } from "../../lib/FishImage";
import { getFishData } from '../../lib/Data';
import Styles from '../../Styles';


export default class ResultsScreen extends Component {
  static navigationOptions = {
    title: 'Results'
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const fishes = this.props.navigation.state.params.fishes;
    var resultsStr = "";
    fishes.forEach(f => {
      if (resultsStr !== "") {
        resultsStr += ", ";
      }
      resultsStr += f.class + ": " + f.confidence.toFixed(2);
    });
    const firebaseParameterValueLength = 100;
    const data = { results: resultsStr.substring(0, firebaseParameterValueLength) };
    logEvent("results", data);
  }

  listItemOnPress = className => {
    const fish = getFishData(className);
    this.props.navigation.navigate("Fish", { fish: fish, isResult: true });
  }

  renderListItem = (item, key) => {
    const fishImage = getFishThumbnail(item.className);
    const leftIcon = fishImage === null
      ? <Text style={{ height: 40, width: 100, marginLeft: 20, marginTop: 15 }}>No image</Text>
      : <Image source={fishImage} style={{ resizeMode: 'contain', height: 40, width: 100, marginRight: 20 }}/>; 
    const subtitle = `${(item.confidence * 100).toFixed(0)} % confidence`;

    return <ListItem
      key={key}
      title={item.commonName}
      subtitle={<Text style={{ color: "#CCC" }}>{subtitle}</Text>}
      leftIcon={leftIcon}
      onPress={() => { this.listItemOnPress(item.className); }}
      containerStyle={Styles.listItemContainer}
    />
  }

  render() {
		const { state } = this.props.navigation;
    const fishes = state.params.fishes;
    if (fishes === null || fishes.length < 1) {
      throw "fishes must be an array of more than one class name.";
    }
    const items = fishes.map(x => ({ commonName: getFishData(x.class).commonName, className: x.class, confidence: x.confidence }));
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          {items.map(this.renderListItem)}
        </ScrollView>
      </View>
    );
  }
}
