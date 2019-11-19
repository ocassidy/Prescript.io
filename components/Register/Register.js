import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  YellowBox,
} from 'react-native';
import firebase from "../../firebaseConfig.js";
import {TouchableWithoutFeedback} from "react-native-web";

YellowBox.ignoreWarnings(['Setting a timer']);
export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      error: false,
      errorMessage: ''
    }
  }

  handleRegister = () => {
    const {email, password} = this.state;

    firebase
      .auth()
      .createUserWithEmailAndPassword(email.trim(), password.trim())
      .then((response) => {
        console.log(response.user.uid);
        this.saveUserDetailsToDatabaseAndUpdateDisplayName(response.user);
        this.sendRegistrationEmail(response.user);
        this.props.navigation.navigate('Profile');
      })
      .catch((error) => {
        this.setState({errorMessage: error.message, error: true})
      });
  };

  saveUserDetailsToDatabaseAndUpdateDisplayName = (user) => {
    const {firstName, lastName, email, username} = this.state;

    firebase
      .database()
      .ref('users/' + user.uid)
      .set({
        firstName,
        lastName,
        email,
        username
      })
      .then(response => {
        console.log('database response ', response);
      }).catch((error) => {
      console.log('error ', error);
    });

    user.updateProfile({
      displayName: username
    }).then(response => {
      console.log('update profile response ', response);
    }, function (error) {
      console.log(error);
    });
  };

  sendRegistrationEmail = (user) => {
    user.sendEmailVerification()
      .then(response => {
        console.log('response ', response);
      }).catch((error) => {
      console.log('error ', error);
    });
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null} enabled>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Text style={styles.appTitle}>
              Prescript.io
            </Text>
            <Text style={styles.appText}>
              Your Prescription Management App
            </Text>
            <Text style={styles.pageTitle}>
              Register
            </Text>

            <View style={styles.firstNameLastNameRow}>
              <View>
                <TextInput style={styles.textNameInput}
                           placeholder="First Name"
                           onChangeText={text => this.setState({firstName: text})}/>
              </View>

              <View>
                <TextInput style={styles.textNameInput}
                           placeholder="Last Name"
                           onChangeText={text => this.setState({lastName: text})}/>
              </View>
            </View>

            <TextInput style={styles.textInput}
                       placeholder="Email"
                       onChangeText={text => this.setState({email: text})}/>

            <TextInput style={styles.textInput}
                       placeholder="Username"
                       onChangeText={text => this.setState({username: text})}/>

            <TextInput style={styles.textInput}
                       placeholder="Password"
                       onChangeText={text => this.setState({password: text})}
                       secureTextEntry={true}/>

            <TouchableOpacity onPress={this.handleRegister}>
              <Text style={styles.registerButton}>
                Register
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigate('Login')}>
              <Text style={styles.loginButton}>
                Have an account? Login Here
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
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
  textInput: {
    fontSize: 20,
    marginBottom: 10,
    padding: 5,
    borderBottomWidth: 1,
    borderColor: 'grey',
    minWidth: 275,
    textAlign: 'center'
  },
  textNameInput: {
    margin: 8,
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: 'grey',
    minWidth: 175,
    textAlign: 'center'
  },
  registerButton: {
    fontSize: 20,
    margin: 10,
    padding: 10,
    color: 'white',
    backgroundColor: '#44a2ff',
    minWidth: 100,
    textAlign: 'center'
  },
  loginButton: {
    fontSize: 20,
    margin: 10,
    padding: 10,
    color: '#44a2ff',
    textAlign: 'center'
  },
  firstNameLastNameRow: {
    flexDirection: 'row'
  }
});
