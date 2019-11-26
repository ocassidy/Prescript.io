import firebase from "../../firebaseConfig";
import {Alert} from "react-native";

export function sendRegistrationEmail (user) {
  user.sendEmailVerification()
    .then(response => {
      Alert.alert(
        'Verification Email Sent',
        'Please Check Your Email.',
        [
          {text: 'Close'},
        ],
        {cancelable: false}
      )
    }).catch((error) => {
    Alert.alert(
      'Verification Email Not Sent',
      error.message,
      [
        {text: 'Close'},
      ],
      {cancelable: false}
    )
  });
}

export function signOut(navigation) {
  firebase.auth().signOut().then(() => {
    navigation.navigate('Login', {loggedOut: true})
  }).catch((error) => {
    console.log(error);
    return error
  });
}
