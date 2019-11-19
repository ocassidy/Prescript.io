import React, {Component} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import firebase from "../../firebaseConfig.js";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorMessage: '',
      name: '',
      email: '',
      photoUrl: '',
      emailVerified: false,
      uid: ''
    }
  }

  signOut = () => {
    firebase.auth().signOut().then(() => {
      this.props.navigation.navigate('Login')
    }).catch(function (error) {
      this.setState({errorMessage: error.message, error: true})
    });
  };

  componentDidMount() {
    let user = firebase.auth().currentUser;

    if (user != null) {
      this.setState({
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        emailVerified: user.emailVerified,
        uid: user.uid,
      })
    }
  }

  render() {
    const {name, email, photoUrl, emailVerified} = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null} enabled>
        <View style={styles.inner}>
          <Text style={styles.appText}>Profile</Text>

          <Text style={styles.appText}>
            Hi {name ? name : undefined}!
          </Text>

          <Text style={styles.appText}>
            Your current email is {email ? email : undefined}!
          </Text>

          <Text style={styles.appText}>
            Your email {emailVerified ? 'is' : 'is not'} verified.
          </Text>

          <TouchableOpacity onPress={this.signOut}>
            <Text style={styles.changePasswordButton}>
              Change Password
            </Text>
          </TouchableOpacity>

          <View style={styles.logoutDeleteAccountRow}>
            <View>
              <TouchableOpacity onPress={this.signOut}>
                <Text style={styles.logoutButton}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity onPress={this.signOut}>
                <Text style={styles.deleteAccountButton}>
                  Delete Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
    fontSize: 18,
    padding: 5
  },
  changePasswordButton: {
    fontSize: 20,
    margin: 10,
    padding: 10,
    color: 'white',
    backgroundColor: '#ffcb1d',
    minWidth: 100,
    textAlign: 'center'
  },
  logoutButton: {
    fontSize: 20,
    margin: 10,
    padding: 10,
    color: 'white',
    backgroundColor: '#44a2ff',
    minWidth: 100,
    textAlign: 'center'
  },
  deleteAccountButton: {
    fontSize: 20,
    margin: 10,
    padding: 10,
    color: 'white',
    backgroundColor: '#ff142b',
    textAlign: 'center'
  },
  textInput: {
    fontSize: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'grey',
    minWidth: 275,
    textAlign: 'center'
  },
  logoutDeleteAccountRow: {
    flexDirection: 'row'
  }
});
