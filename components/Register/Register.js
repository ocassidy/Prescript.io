import React, { Component } from 'react';
import {
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  YellowBox,
} from 'react-native';
import firebase from "../../firebaseConfig.js";
import { Formik } from "formik";
import * as Yup from "yup";
import { ErrorMessage } from "../common/ErrorMessage";
import {
  Button,
  Text,
  TextInput
} from 'react-native-paper';
import styles from '../themes/styles';

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(5, 'Must Be At Least 5 Characters')
    .required('Please enter your First Name'),
  lastName: Yup.string()
    .min(5, 'Must Be At Least 5 Characters')
    .required('Please enter your Last Name'),
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a registered email'),
  username: Yup.string()
    .min(5, 'Must Be At Least 5 Characters')
    .required('Please enter your Username'),
  password: Yup.string()
    .min(6, 'Must have at least 6 characters')
    .max(50, 'Must not be more than 50 characters')
    .required('Required'),
});

YellowBox.ignoreWarnings(['Setting a timer']);
export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorMessage: ''
    }
  }

  handleRegister = (values) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(values.email.trim(), values.password.trim())
      .then((response) => {
        this.saveUserDetailsToDatabaseAndUpdateDisplayName(response.user, values);
        this.sendRegistrationEmail(response.user);
        this.props.navigation.navigate('Profile');
      })
      .catch((error) => {
        this.setState({ errorMessage: error.message, error: true })
      });
  };

  saveUserDetailsToDatabaseAndUpdateDisplayName = (user, values) => {
    const { firstName, lastName, email, username } = values;

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
    const { navigate } = this.props.navigation;
    const { theme } = this.props;
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

            <Formik initialValues={{ firstName: '', lastName: '', email: '', username: '', password: '' }}
              onSubmit={values => this.handleRegister(values)}
              validationSchema={RegisterSchema}>
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
                    <View style={styles.firstNameLastNameRow}>
                      <View>
                        <TextInput
                          theme={theme}
                          placeholder="First Name"
                          onChangeText={handleChange('firstName')}
                          onBlur={handleBlur('firstName')}
                          value={values.firstName}
                          mode='outlined' />
                        <ErrorMessage errorValue={touched.firstName && errors.firstName} />
                      </View>

                      <View>
                        <TextInput
                          theme={theme}
                          placeholder="Last Name"
                          onChangeText={handleChange('lastName')}
                          onBlur={handleBlur('lastName')}
                          value={values.lastName}
                          mode='outlined' />
                        <ErrorMessage errorValue={touched.lastName && errors.lastName} />
                      </View>
                    </View>

                    <TextInput
                      theme={theme}
                      placeholder="Email"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      mode='outlined' />
                    <ErrorMessage errorValue={touched.email && errors.email} />

                    <TextInput
                      theme={theme}
                      placeholder="Username"
                      onChangeText={handleChange('username')}
                      onBlur={handleBlur('username')}
                      value={values.username}
                      mode='outlined' />
                    <ErrorMessage errorValue={touched.username && errors.username} />

                    <TextInput
                      theme={theme}
                      placeholder="Password"
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      secureTextEntry={true}
                      value={values.password}
                      mode='outlined' />
                    <ErrorMessage errorValue={touched.password && errors.password} />

                    <Button theme={theme}
                      onPress={handleSubmit}
                      disabled={!isValid || isSubmitting}
                      mode="contained"
                      labelStyle={styles.buttonTextColour}>
                      Register
                    </Button>
                  </View>
                )}
            </Formik>

            <Button style={styles.buttonSpacing} theme={theme} onPress={() => navigate('Login')}>
              Have an account? Login Here
            </Button>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    )
  }
}