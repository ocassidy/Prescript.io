import styles from "../themes/styles";
import {ActivityIndicator, Text} from "react-native-paper";
import {View} from "react-native";
import React from "react";

export default function IsLoadingSpinner() {
  return (
    <View style={styles.spinner}>
      <ActivityIndicator size="large" color="black" />
      <Text style={styles.appText}>Loading Please Wait...</Text>
    </View>
  )
}
