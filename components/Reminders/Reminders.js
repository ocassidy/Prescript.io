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
export default class Reminders extends Component {
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
    // let user = firebase.auth().currentUser;

    // if (user != null) {
    //   this.setState({
    //     name: user.displayName,
    //     email: user.email,
    //     photoUrl: user.photoURL,
    //     emailVerified: user.emailVerified,
    //     uid: user.uid,
    //   })
    // }
    //TODO: ADD CODE TO RETREIEVE REMINDERS
  }

  componentDidUpdate() {
    //this.getUserData();
    //TODO: ADD CODE TO RETREIEVE REMINDERS
  }

  //TODO: ADD CODE TO RETREIEVE REMINDERS
//   getUserData = () => {
//     const { uid } = this.state;

//     firebase.database().ref('users/' + uid)
//       .on('value', (snapshot) => {
//         console.log('snapshot.val()', snapshot.val());
//       },
//         (error) => {
//           console.log("Error:", error.code);
//         }
//       );
//   };

//   setModalVisible(visible) {
//     this.setState({ modalVisible: visible });
//   }



  render() {
    const { theme } = this.props;
    const { name, email, photoUrl, emailVerified, address, phoneNumber } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null} enabled>
        <View style={styles.inner}>
          {name ? <Text style={styles.appText} theme={theme}>Hi {name}!</Text> : undefined}
          <Text style={styles.appText} theme={theme}>Your Reminders:</Text>

          <Button style={styles.buttonSpacing} theme={theme} onPress={() => console.log('test')}>
            Add Reminder
          </Button>

          <Button style={styles.buttonSpacing} theme={theme} onPress={() => console.log('test')}>
            Remove Reminder
          </Button>
        </View>
      </KeyboardAvoidingView>
    )
  }
}