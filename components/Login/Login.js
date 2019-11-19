import React, {Component} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';
import firebase from "../../firebaseConfig.js";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameOrEmail: '',
      password: '',
      error: false,
      errorMessage: '',
      isLoading: true
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({
        isLoading: false,
        user,
      });
      this.props.navigation.navigate('Profile')
    });
  };

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
    let {isLoading} = this.state;
    return (
      <View>
        {isLoading ?
          <View style={styles.spinner}>
            <ActivityIndicator size="large" color="black"/>
            <Text>Loading Please Wait...</Text>
          </View> :
          <View style={styles.container}>
            <Text style={styles.appTitle}>
              Prescript.io
            </Text>
            <Text style={styles.appText}>
              Your Prescription Management App
            </Text>
            <Text style={styles.pageTitle}>
              Login
            </Text>
            <Text style={styles.appText}>Username/Email</Text>
            <TextInput style={styles.textInput} onChangeText={text => this.setState({usernameOrEmail: text})}/>

            <Text style={styles.appText}>Password</Text>
            <TextInput style={styles.textInput} onChangeText={text => this.setState({password: text})}
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
          </View>}
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
  spinner: {
    marginTop: 350,
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
