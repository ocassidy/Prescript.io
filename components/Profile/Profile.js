import React, {Component} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  YellowBox,
  BackHandler, Alert
} from 'react-native'
import {
  Text,
  Button,
} from 'react-native-paper';
import AddInfoModal from './AddInfoModal'
import firebase from "../../firebaseConfig.js";
import styles from '../themes/styles';
import IsLoadingSpinner from "../common/IsLoadingSpinner";
import {sendRegistrationEmail, signOut} from "../common/utils";
import ChangePasswordModal from "./ChangePasswordModal";
import DeleteAccountModal from "./DeleteAccountModal";
import {db} from "../../firebaseConfig";

YellowBox.ignoreWarnings(['Setting a timer']);
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorMessage: '',
      address: '',
      phoneNumber: '',
      addInfoModalModalVisible: false,
      modalSuccessTextVisible: false,
      isUserDataLoading: true,
      isUserLoading: true,
      user: null,
      userIndicationOnAccountDelete: false,
      changePasswordModalVisible: false,
      deleteAccountModalVisible: false
    }
  }

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

    db.collection('users')
      .doc(uid)
      .get()
      .then(document => {
        this.setState({
          address: document._document.proto.fields.address.stringValue,
          phoneNumber: document._document.proto.fields.phoneNumber.stringValue
        })
      })
      .catch(error => {
        console.log('failed to retrieve address or phoneNumber', error)
      });
  };

  setAddInfoModalVisible = (visible) => {
    if (visible) {
      this.setState({addInfoModalVisible: true});
    } else {
      this.setState({addInfoModalVisible: false});
    }
  };

  setChangePasswordModalVisible = (visible) => {
    if (visible) {
      this.setState({changePasswordModalVisible: true});
    } else {
      this.setState({changePasswordModalVisible: false});
    }
  };

  setDeleteAccountModalVisible = (visible) => {
    if (visible) {
      this.setState({deleteAccountModalVisible: true});
    } else {
      this.setState({deleteAccountModalVisible: false});
    }
  };

  saveUserDetailsAddressAndPhoneNumber = async (values) => {
    const {uid} = this.state.user;
    const {address, phoneNumber} = values;

    let data = {
      address: address.trim(),
      phoneNumber: phoneNumber.trim(),
    };

    db.collection('users')
      .doc(uid)
      .update(data)
      .then(response => {
        this.setState({
          modalSuccessTextVisible: true
        });
        console.log('successful add of address/phoneNumber to user on id', response)
      })
      .catch(error => console.log('unsuccessful add of address/phoneNumber to user', uid, error));

    await this.getUserData(uid);
  };

  reAuthForSensitiveActions = (user, currentPassword) => {
    let credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    user.reauthenticateWithCredential(credential)
      .then(() => {
        console.log('reauthenticated')
      })
      .catch((error) => {
        console.log(error)
      });
  };

  deleteAccount = (values) => {
    let user = firebase.auth().currentUser;
    this.reAuthForSensitiveActions(user, values.password);

    Alert.alert(
      'Delete Account',
      'Are you sure your wish to delete your account?',
      [
        {
          text: 'Yes',
          onPress: () =>
            user.delete()
              .then(() => {
                db.collection('users')
                  .doc(user.uid)
                  .delete()
                  .then(response => {
                    console.log('successful delete of user', user.uid, response)
                  })
                  .catch(error => console.log('unsuccessful delete of user', user.uid, error));
                signOut(this.props.navigation, 'You have successfully deleted your account.')
              }).catch((error) => {
              console.log(error)
            })
        },
        {text: 'No', onPress: () => this.setState({userIndicationOnAccountDelete: false})}
      ],
      {cancelable: false}
    );
  };

  updatePassword = (values) => {
    let user = firebase.auth().currentUser;
    this.reAuthForSensitiveActions(user, values.oldPassword);

    user.updatePassword(values.newPassword)
      .then(() => {
        signOut(this.props.navigation, 'You have changed your password, please log in again.');
      })
      .catch((error) => {
        console.log(error)
      })
  };

  render() {
    const {theme, navigation} = this.props;
    const {address, phoneNumber, user, addInfoModalVisible, changePasswordModalVisible, deleteAccountModalVisible} = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null} enabled>
        {user
          ? <View style={styles.inner}>
            {user.displayName ? <Text style={styles.appText} theme={theme}>Hi {user.displayName}!</Text> : null}
            <Text style={styles.appText} theme={theme}>Welcome to your profile.</Text>
            <Text style={styles.appText} theme={theme}>Your details:</Text>
            <Text style={styles.appText} theme={theme}>Your current email
              is {user.email ? user.email : undefined}</Text>
            <Text style={styles.appText} theme={theme}>Your
              email {user.emailVerified ? 'is' : 'is not'} verified.</Text>
            {!user.emailVerified
              ? <Button style={styles.buttonSpacing}
                        theme={theme}
                        onPress={() => {
                          sendRegistrationEmail(user)
                        }}
                        mode='outlined'>
                Resend Password Verification
              </Button>
              : null}

            <Text style={styles.appText} theme={theme}>
              Your address {address ? 'is' : 'is not set'} {address ? address : null}.
            </Text>

            <Text style={styles.appText} theme={theme}>
              Your Phone Number {phoneNumber ? 'is' : 'is not set'} {phoneNumber ? phoneNumber : null}.
            </Text>

            {!address || !phoneNumber ?
              <Button style={styles.buttonSpacing}
                      theme={theme}
                      onPress={() => {
                        this.setAddInfoModalVisible(true)
                      }}
                      mode='outlined'
                      disabled={address && phoneNumber}>
                Add An Address and Phone Number?
              </Button>
              : null}

            {addInfoModalVisible
              ? <AddInfoModal
                saveUserDetailsAddressAndPhoneNumber={this.saveUserDetailsAddressAndPhoneNumber}
                modalSuccessTextVisible={this.state.modalSuccessTextVisible}
                setModalVisible={() => this.setAddInfoModalVisible()}
                animationType="fade"
                transparent={false}
                onRequestClose={() => this.setAddInfoModalVisible()}>
              </AddInfoModal>
              : null}

            {changePasswordModalVisible
              ? <ChangePasswordModal
                updatePassword={this.updatePassword}
                modalSuccessTextVisible={this.state.modalSuccessTextVisible}
                setModalVisible={() => this.setChangePasswordModalVisible()}
                animationType="fade"
                transparent={false}
                onRequestClose={() => this.setChangePasswordModalVisible()}>
              </ChangePasswordModal>
              : null}

            {deleteAccountModalVisible
              ? <DeleteAccountModal
                deleteAccount={this.deleteAccount}
                modalSuccessTextVisible={this.state.modalSuccessTextVisible}
                setModalVisible={() => this.setDeleteAccountModalVisible()}
                animationType="fade"
                transparent={false}
                onRequestClose={() => this.setDeleteAccountModalVisible()}>
              </DeleteAccountModal>
              : undefined}

            <Button style={styles.buttonSpacing}
                    theme={theme}
                    onPress={() => this.setChangePasswordModalVisible(true)}
                    mode='outlined'>
              Change Password
            </Button>

            <View>
              <Button style={styles.buttonSpacing} theme={theme}
                      onPress={() => signOut(navigation, 'You have logged out.')}
                      mode='contained'
                      labelStyle={styles.buttonTextColour}>
                Logout
              </Button>
            </View>

            <Button style={styles.buttonSpacing}
                    theme={theme}
                    onPress={() => this.setDeleteAccountModalVisible(true)}
                    mode="contained"
                    color={'red'}
                    labelStyle={styles.buttonTextColour}>
              Delete Account
            </Button>
          </View>
          : <IsLoadingSpinner/>}
      </KeyboardAvoidingView>
    )
  }
}
