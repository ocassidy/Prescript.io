import React, { Component } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  YellowBox
} from 'react-native';
import {
  Button,
  Text,
  TextInput
} from 'react-native-paper';
import firebase from "../../firebaseConfig.js";
import * as Yup from "yup";
import { ErrorMessage } from "../common/ErrorMessage";
import { Formik } from "formik";
import styles from '../themes/styles';

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a registered email'),
});

YellowBox.ignoreWarnings(['Setting a timer']);
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      error: false,
      errorMessage: ''
    }
  }

  handleReset = (values) => {
    let auth = firebase.auth();
    let { email } = values;

    auth.sendPasswordResetEmail(email.trim())
      .then(() => {
        Alert.alert(
          'Email Sent',
          'Please Check Your Email.',
          [
            { text: 'Return To Login', onPress: () => this.props.navigation.navigate('Login') },
            { text: 'Ok' },
          ],
          { cancelable: false }
        )
      }).catch((error) => {
        if (error.message === 'There is no user record corresponding to this identifier. The user may have been deleted.') {
          this.setState({
            error: true,
            errorMessage: 'Email Not Found'
          })
        }
        else {
          this.setState({
            error: true,
            errorMessage: 'Password Not Reset'
          })
        }
      });
  };

  render() {
    const { navigate } = this.props.navigation;
    const { theme } = this.props
    const { errorMessage } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null} enabled>
        <View style={styles.inner}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <Text style={styles.pageTitle}>Password Reset</Text>
              <Text style={styles.appText}>To reset your password please enter you email below.</Text>

              <Formik initialValues={{ email: '' }}
                onSubmit={values => this.handleReset(values)}
                validationSchema={ResetPasswordSchema}>
                {({
                  handleChange,
                  values,
                  handleSubmit,
                  errors,
                  isValid,
                  touched,
                  handleBlur,
                  isSubmitting
                }) => (
                    <View>
                      <TextInput
                        theme={theme}
                        placeholder="Email"
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                        mode='outlined' />
                      <ErrorMessage errorValue={(touched.email && errors.email) || (touched.email && errorMessage)} />

                      <Button theme={theme} onPress={handleSubmit}
                        disabled={!isValid || isSubmitting}
                        mode="contained"
                        labelStyle={styles.buttonTextColour}>
                        Reset Password
                      </Button>
                    </View>
                  )}
              </Formik>

              <Button style={styles.buttonSpacing} theme={theme} onPress={() => navigate('Login')}>
                Return To Login
              </Button>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAvoidingView>
    )
  }
}