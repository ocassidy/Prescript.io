import React, {Component} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  YellowBox,
  BackHandler
} from 'react-native'
import {
  Text,
  Button,
  ActivityIndicator
} from 'react-native-paper';
import AddInfoModal from './AddInfoModal'
import firebase from "../../firebaseConfig.js";
import styles from '../themes/styles';
import IsLoadingSpinner from "../common/IsLoadingSpinner";
import {sendRegistrationEmail} from "../utils";

YellowBox.ignoreWarnings(['Setting a timer']);
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorMessage: '',
      address: '',
      phoneNumber: '',
      modalVisible: false,
      modalSuccessTextVisible: false,
      isUserDataLoading: true,
      isUserLoading: true,
      user: null
    }
  }

  signOut = () => {
    firebase.auth().signOut().then(() => {
      this.props.navigation.navigate('Login')
    }).catch(function (error) {
      this.setState({errorMessage: error.message, error: true})
    });
  };

  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', () => true);
    let user = firebase.auth().currentUser;

    if (user != null) {
      this.setState({
        user: user,
      });
      this.getUserData(user.uid);
    }
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => false);
  }

  getUserData = (uid) => {
    if (this.state.uid) {
      uid = this.state.uid
    }

    firebase.database().ref('users/' + uid)
      .on('value', (snapshot) => {
          this.setState({
            address: snapshot.val().address,
            phoneNumber: snapshot.val().phoneNumber,
          })
        },
        (error) => {
          console.log("Error:", error);
        }
      );
  };

  setModalVisible = (visible) => {
    if (visible) {
      this.setState({modalVisible: true});
    } else {
      this.setState({modalVisible: false});
    }
  };

  saveUserDetailsAddressAndPhoneNumber = (values) => {
    const {uid} = this.state;
    const {address, phoneNumber} = values;

    firebase
      .database()
      .ref('users/' + uid)
      .update({
        address,
        phoneNumber
      })
      .then(response => {
        console.log('database response ', response);
        this.setState({
          modalSuccessTextVisible: true
        })
      }).catch((error) => {
      console.log('error ', error);
    });
  };

  render() {
    const {theme} = this.props;
    const {address, phoneNumber, user} = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null} enabled>
        {user === null ?
          <IsLoadingSpinner/> :
          <View style={styles.inner}>
            {user.displayName ? <Text style={styles.appText} theme={theme}>Hi {user.displayName}!</Text> : undefined}
            <Text style={styles.appText} theme={theme}>Welcome to your profile.</Text>
            <Text style={styles.appText} theme={theme}>Your details:</Text>
            <Text style={styles.appText} theme={theme}>Your current email is {user.email ? user.email : undefined}</Text>
            <Text style={styles.appText} theme={theme}>Your email {user.emailVerified ? 'is' : 'is not'} verified.</Text>
            {
              !user.emailVerified ? <Button style={styles.buttonSpacing} theme={theme} onPress={() => {
                  sendRegistrationEmail(user)
                }}>
                  Resend Password Verification
                </Button>
                : undefined
            }
            <Text style={styles.appText} theme={theme}>
              Your address {address ? 'is' : 'is not set'} {address ? address : undefined}.
            </Text>

            <Text style={styles.appText} theme={theme}>
              Your Phone Number {phoneNumber ? 'is' : 'is not set'} {phoneNumber ? phoneNumber : undefined}.
            </Text>

            {
              !address || !phoneNumber ?
                <Button style={styles.buttonSpacing} theme={theme} onPress={() => {
                  this.setModalVisible(true)
                }}>
                  Add An {!address ? 'Address' : undefined} and {!phoneNumber ? 'Phone Number' : undefined}?
                </Button>
                : undefined
            }

            {
              this.state.modalVisible
                ? <AddInfoModal
                  visible={this.state.modalVisible}
                  saveUserDetailsAddressAndPhoneNumber={this.saveUserDetailsAddressAndPhoneNumber}
                  modalSuccessTextVisible={this.state.modalSuccessTextVisible}
                  setModalVisible={this.setModalVisible}
                  animationType="fade"
                  transparent={false}
                  onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                  }}>
                </AddInfoModal>
                : undefined
            }

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
          </View>}
      </KeyboardAvoidingView>
    )
  }
}
