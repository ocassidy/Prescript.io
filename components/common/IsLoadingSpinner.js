import styles from "../themes/styles";
import {ActivityIndicator, Text} from "react-native-paper";
import {View} from "react-native";
import React from "react";

console.disableYellowBox = true;
export default function IsLoadingSpinner(props) {
  const {isSmallSpinner} = props;
  return (
    <View>
      {isSmallSpinner
        ? <View style={styles.smallSpinner}>
          <ActivityIndicator size="small" color="black"/>
        </View>
        : <View style={styles.spinner}>
          <ActivityIndicator size="large" color="black"/>
          <Text style={styles.appText}>Loading Please Wait...</Text>
        </View>
      }
    </View>
  )
}
