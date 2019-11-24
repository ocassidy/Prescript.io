import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Modal,
  TouchableHighlight,
  YellowBox
} from 'react-native'
import {
  Text,
  Button
} from 'react-native-paper';
import firebase from "../../firebaseConfig.js";
import styles from '../themes/styles';


YellowBox.ignoreWarnings(['Setting a timer']);
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
      uid: '',
      address: '',
      phoneNumber: '',
      modalVisible: false,
    }
  }

  signOut = () => {
    firebase.auth().signOut().then(() => {
      this.props.navigation.navigate('Login')
    }).catch(function (error) {
      this.setState({ errorMessage: error.message, error: true })
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

  componentDidUpdate() {
    this.getUserData();
  }

  getUserData = () => {
    const { uid } = this.state;

    firebase.database().ref('users/' + uid)
      .on('value', (snapshot) => {
        console.log('snapshot.val()', snapshot.val());
      },
        (error) => {
          console.log("Error:", error.code);
        }
      );
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  saveUserDetailsAddressAndPhoneNumber = () => {
    const { uid, address, phoneNumber } = this.state;

    firebase
      .database()
      .ref('users/' + uid)
      .set({
        address,
        phoneNumber
      })
      .then(response => {
        console.log('database response ', response);
      }).catch((error) => {
        console.log('error ', error);
      });
  };

  render() {
    const { theme } = this.props;
    const { name, email, photoUrl, emailVerified, address, phoneNumber } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null} enabled>
        <View style={styles.inner}>
          {name ? <Text style={styles.appText} theme={theme}>Hi {name}!</Text> : undefined}
          <Text style={styles.appText} theme={theme}>Welcome to your profile.</Text>
          <Text style={styles.appText} theme={theme}>Your details:</Text>
          <Text style={styles.appText} theme={theme}>Your current email is {email ? email : undefined}</Text>
          <Text style={styles.appText} theme={theme}>Your email {emailVerified ? 'is' : 'is not'} verified.</Text>
          <Text style={styles.appText} theme={theme}>
            Your address {address ? 'is' : 'is not set'} {address ? address : undefined}.
          </Text>

          <Text style={styles.appText} theme={theme}>
            Your Phone Number {phoneNumber ? 'is' : 'is not set'} {phoneNumber ? phoneNumber : undefined}.
          </Text>

          {
            !address || !phoneNumber ?
              <Button style={styles.buttonSpacing} theme={theme} onPress={() => {
                this.setModalVisible(true);
              }}>
                Add An {!address ? 'Address' : undefined} and {!phoneNumber ? 'Phone Number' : undefined}?
              </Button>
              : undefined
          }

          {this.state.modalVisible
            ? <Modal
              animationType="fade"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              <View style={styles.inner}>
                <View>
                  <Text style={styles.appText}>Hello World!</Text>

                  <TouchableHighlight
                    onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                    }}>
                    <Text style={styles.appText}>Hide Modal</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
            : undefined}

          <View style={styles.logoutDeleteAccountRow}>
            <View>
              <Button style={styles.buttonSpacing} theme={theme} onPress={this.signOut}>
                Logout
              </Button>
            </View>

            <Button style={styles.buttonSpacing} theme={theme} onPress={this.signOut}>
              Change Password
            </Button>

            <View>
              <Button style={styles.buttonSpacing}
                theme={theme}
                onPress={this.signOut}
                mode="contained"
                color={'red'}
                labelStyle={styles.buttonTextColour}>
                Delete Account
              </Button>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
}