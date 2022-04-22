import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  FlatList
} from 'react-native';
import firebase from 'react-native-firebase';
import { ListItem } from '../Common';
import { getFishThumbnail } from "../../lib/FishImage";
import { getAllFishData } from '../../lib/Data';
import Styles from '../../Styles';

export default class ListScreen extends Component {
  static navigationOptions = {
    title: 'All Fish'
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
		firebase.analytics().setCurrentScreen(ListScreen.navigationOptions.title);
  }

  listItemOnPress = fish => {
    console.log("test");
    console.log(this.props.navigation.state);
    this.props.navigation.navigate("Fish", { fish: fish, isResult: false });
    console.log(this.props.navigation.state);
  }

  getFishSubtitle = fish => {
    //return fish.OtherNames === null ? "" : fish.OtherNames.join(", ");
    return "";
  }

  renderItem = data => {
    const fish = data.item;
    const subtitle = this.getFishSubtitle(fish);
    const fishImage = getFishThumbnail(fish.className);
    const leftIcon = fishImage === null ? <Text style={{ height: 40, width: 100, marginLeft: 20, marginTop: 15 }}>No image</Text> : <Image source={fishImage} style={{ resizeMode: 'contain', height: 40, width: 100, marginRight: 20 }}/>; 

    return <ListItem
      title={fish.commonName}
      subtitle={<Text style={{ color: "#CCC" }}>{subtitle}</Text>}
      leftIcon={leftIcon}
      onPress={() => { this.listItemOnPress(fish); }}
      containerStyle={Styles.listItemContainer}
    />
  }

  render() {
		const { navigate, goBack, state } = this.props.navigation;
    var fishes = state.params === undefined ? null : state.params.fishes;
    if (fishes === null) {
      fishes = getAllFishData(); 
    } else if (fishes.length <= 1) {
      throw "fishes must be an array of more than one class name.";
    }
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <FlatList
            containerStyle={{ marginTop: 0 }}
            renderItem={this.renderItem}
            data={fishes}
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>
      </View>
    );
  }
}
