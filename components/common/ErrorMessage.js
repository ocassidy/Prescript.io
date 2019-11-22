import React from "react";
import {
  Text,
  View,
  StyleSheet
} from "react-native";

export const ErrorMessage = ({errorValue}) => (
  <View>
    <Text style={styles.errorText}>{errorValue}</Text>
  </View>
);

const styles = StyleSheet.create({
  errorText: {
    flexWrap:"wrap",
    color: 'red',
    textAlign: 'left',
    paddingBottom: 15
  }
});
