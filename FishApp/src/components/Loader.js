import React from 'react';
import {
  View,
} from 'react-native';
import { ActivityIndicator } from 'react-native';
import Styles, { PRIMARY_BLUE } from '../Styles';

export default () => {
    return <View style={Styles.activityIndicatorView}><ActivityIndicator size="large" color={PRIMARY_BLUE} /></View>;
}