import React from "react";
import {
  Text,
  View,
} from "react-native";
import styles from '../themes/styles';

export const ErrorMessage = ({errorValue}) => (
  <View>
    <Text style={styles.errorText}>{errorValue}</Text>
  </View>
);
