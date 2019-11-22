import React, {Component} from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  YellowBox
} from 'react-native';
import firebase from "../../firebaseConfig.js";
import {TouchableWithoutFeedback} from "react-native-web";

YellowBox.ignoreWarnings(['Setting a timer']);
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    }
  }

  handleReset = () => {
    let auth = firebase.auth();
    let {email} = this.state;

    auth.sendPasswordResetEmail(email.trim())
      .then(() => {
        Alert.alert(
          'Email Sent',
          'Please Check Your Email.',
          [
            {text: 'Return To Login', onPress: () => this.props.navigation.navigate('Login')},
            {text: 'Ok'},
          ],
          {cancelable: false}
        )
      }).catch(function (error) {

      Alert.alert(
        email.length < 1 ? 'Please Enter Your Email' : (email ? 'Password Reset Unsuccessful' : 'Email Not Found'),
        'Your Password Has Not Been Reset',
        [
          {text: 'Ok'},
        ],
        {cancelable: false}
      )
    });
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null} enabled>
        <View style={styles.inner}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <Text style={styles.pageTitle}>Password Reset</Text>
              <Text style={styles.appText}>To reset your password please enter you email below.</Text>
              <TextInput style={styles.textInput}
                         placeholder="Email"
                         onChangeText={text => this.setState({email: text})}/>

              <TouchableOpacity onPress={this.handleReset}>
                <Text style={styles.resetButton}>
                  Reset Password
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigate('Login')}>
                <Text style={styles.returnToLoginButton}>
                  Return To Login
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inner: {
    padding: 20,
    textAlign: 'center',
    textAlignVertical: "center",
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 26,
    padding: 10,
    textAlign: 'center',
  },
  appText: {
    fontSize: 20,
    padding: 10,
    textAlign: 'center'
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
  resetButton: {
    fontSize: 20,
    margin: 10,
    padding: 10,
    color: 'white',
    backgroundColor: '#44a2ff',
    textAlign: 'center'
  },
  returnToLoginButton: {
    fontSize: 20,
    margin: 10,
    padding: 10,
    color: '#44a2ff',
    textAlign: 'center'
  },
  textInput: {
    marginBottom: 10,
    fontSize: 20,
    padding: 5,
    borderBottomWidth: 1,
    borderColor: 'grey',
    minWidth: 275,
    textAlign: 'left'
  },
});
