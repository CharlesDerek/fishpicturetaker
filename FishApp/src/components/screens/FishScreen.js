import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions
} from 'react-native';
import { logEvent } from '../../utils';
import { getFishImage } from "../../lib/FishImage";
import { ImagePermissionsModalContainer } from "../ImagePermissionsModalContainer";

export default class FishScreen extends ImagePermissionsModalContainer {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("fish").commonName
    }
  };
  state = Dimensions.get("window");

  componentWillMount() {
    const isResult = this.props.navigation.getParam("isResult");
    if (isResult === undefined) {
      throw new Error("isResult navigate parameter not defined.");
    } else if (isResult === true) {
      super.conditionallyDisplayModal();
    }

    Dimensions.addEventListener("change", this.dimensionsChangeHandler);
    logEvent("fish", { fishCommonName: this.props.navigation.getParam("fish").commonName });
  }

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.dimensionsChangeHandler);
  }
  
  dimensionsChangeHandler = dimensions => this.setState(dimensions.window);

  render() {
		const { navigate, goBack, state } = this.props.navigation;
    const fish = state.params.fish;
    if (fish === undefined || fish === null) {
      throw "fish property is required.";
    }
    const fishImageResource = getFishImage(fish.className);
    const { height, width } = this.state;
    const isPortrait = height >= width;
    const imageHeight = isPortrait ? 120 : "60%";
    console.log("imageHeight:", imageHeight);
    const textStyle = { lineHeight: 26 };
    const image = fishImageResource === null ? <Text style={textStyle}>No image available.</Text> : <Image source={fishImageResource} style={{ resizeMode: 'contain', width: "100%", height: imageHeight }}/>;
    const boldStyle = { fontWeight: "bold" };
    const noTakeSpeciesInfo = fish.isNoTakeSpecies === true ? <Text style={boldStyle}>This is a no take species. You must gentley return the fish back to water{".\n"}</Text> : "";
    const minSize = fish.minimumSizeInCentimetres === null ? "none" : fish.minimumSizeInCentimetres + "cm";
    const maxSize = fish.maximumSizeInCentimetres === null ? "none" : fish.maximumSizeInCentimetres + "cm";
    const eatingNotes = fish.eatingNotes === null ? null : fish.eatingNotes;
    const fields = {
      "Eating rating": this.getEatingRating(fish),
      "Eating notes": eatingNotes,
      "QLD only": "",
      "Minimum size": minSize,
      "Maximum size": maxSize,
      "Possesion limit": fish.possessionLimit === null ? "none." : fish.possessionLimit,
      "Possesion notes": fish.possessionNotes === null ? null : fish.possessionNotes,
    };
    const fieldTexts = Object.keys(fields)
      .filter(name => fields[name] !== null)
      .map(name => <Text key={name}><Text style={boldStyle}>{name}</Text>: {fields[name]}{"\n"}</Text>);
    return (
      <View style={styles.container}>
        {super.render()}
        {image}
        <Text style={textStyle}>
          {noTakeSpeciesInfo}
          {fieldTexts}
        </Text>
      </View>
    );
  }

  getEatingRating = fish => {
    const rating = fish.edibilityRating;
    const poisonousRating = 0;
    const maximumRating = 5;
    if (rating === null) {
      return "Not Available";
    } else if (rating === poisonousRating) {
      return <Text style={{ color: "red" }}>Poisonous</Text>;
    } else if (poisonousRating < rating && rating <= maximumRating) {
      return `${rating} / 5`;
    } else {
      throw "Invalid rating.";
    }
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#F5FCFF',
  },
});
