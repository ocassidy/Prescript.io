import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

export default class Profile extends Component {
  render() {
    return (
      <View styles={styles.container}>
        <Text styles={styles.appText}>Profile</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    textAlign: 'center',
    justifyContent: 'center',
    textAlignVertical: "center",
    alignItems: 'center'
  },
  appTitle: {
    marginTop: 10,
    fontSize: 30,
    padding: 10
  },
  pageTitle: {
    fontSize: 26,
    padding: 10
  },
  appText: {
    fontSize: 20,
    padding: 10
  },
  loginButton: {
    fontSize: 20,
    margin: 10,
    padding: 10,
    color: 'white',
    backgroundColor: '#44a2ff',
    minWidth: 100,
    textAlign: 'center'
  },
  registerButton: {
    fontSize: 20,
    margin: 10,
    padding: 10,
    color: '#44a2ff',
    textAlign: 'center'
  },
  textInput: {
    fontSize: 20,
    padding: 10,
    borderColor: 'grey',
    borderWidth: 1,
    minWidth: 275,
    textAlign: 'center'
  },
});
