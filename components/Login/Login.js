import React, {Component} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  YellowBox
} from 'react-native';
import firebase from "../../firebaseConfig.js";
import {TouchableWithoutFeedback} from "react-native-web";

YellowBox.ignoreWarnings(['Setting a timer']);
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameOrEmail: '',
      password: '',
      error: false,
      errorMessage: '',
      isLoading: true,
      authenticated: false,
      user: null
    }
  }

  componentDidMount() {
    this.authFirebaseListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true,
          isLoading: false,
          user: user
        });
        this.props.navigation.navigate('Profile')
      } else {
        this.setState({
          authenticated: false,
          isLoading: false,
        });
      }
    });
  };

  componentWillUnmount() {
    this.authFirebaseListener && this.authFirebaseListener()
  }

  handleLogin = () => {
    const {usernameOrEmail, password} = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(usernameOrEmail.trim(), password.trim())
      .then(() => {
        this.props.navigation.navigate('Profile')
      })
      .catch((error) => {
        this.setState({errorMessage: error.message, error: true})
      });
  };

  render() {
    const {navigate} = this.props.navigation;
    let {isLoading, authenticated} = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null} enabled>
        <View style={styles.inner}>
          {isLoading && !authenticated ?
            <View style={styles.spinner}>
              <ActivityIndicator size="large" color="black"/>
              <Text>Loading Please Wait...</Text>
            </View> :
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View>
                <Text style={styles.appTitle}>
                  Prescript.io
                </Text>
                <Text style={styles.appText}>
                  Your Prescription Management App
                </Text>
                <Text style={styles.pageTitle}>
                  Login
                </Text>
                <TextInput style={styles.textInput}
                           placeholder="Email"
                           onChangeText={text => this.setState({usernameOrEmail: text})}/>

                <TextInput style={styles.textInput}
                           placeholder="Password"
                           onChangeText={text => this.setState({password: text})}
                           secureTextEntry={true}/>

                <TouchableOpacity onPress={this.handleLogin}>
                  <Text style={styles.loginButton}>
                    Login
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigate('Register')}>
                  <Text style={styles.registerButton}>
                    Don't have an account? Register Here
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={styles.registerButton}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>}
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
  spinner: {
    marginTop: 350,
    marginBottom: 15,
    padding: 20,
    textAlign: 'center',
    justifyContent: 'center',
    textAlignVertical: "center",
    alignItems: 'center'
  },
  appTitle: {
    marginTop: 15,
    fontSize: 30,
    padding: 10,
    textAlign: 'center',
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
  registerButton: {
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
    textAlign: 'center'
  },
});
