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
import {Formik} from "formik";
import * as Yup from "yup";
import {ErrorMessage} from "../common/ErrorMessage";

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
        console.log(response.user.uid);
        this.saveUserDetailsToDatabaseAndUpdateDisplayName(response.user, values);
        this.sendRegistrationEmail(response.user);
        this.props.navigation.navigate('Profile');
      })
      .catch((error) => {
        this.setState({errorMessage: error.message, error: true})
      });
  };

  saveUserDetailsToDatabaseAndUpdateDisplayName = (user, values) => {
    const {firstName, lastName, email, username} = values;

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

            <Formik initialValues={{firstName: '', lastName: '', email: '', username: '', password: ''}}
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
                      <TextInput style={styles.textNameInput}
                                 placeholder="First Name"
                                 onChangeText={handleChange('firstName')}
                                 onBlur={handleBlur('firstName')}
                                 value={values.firstName}/>
                      <ErrorMessage errorValue={touched.firstName && errors.firstName}/>
                    </View>

                    <View>
                      <TextInput style={styles.textNameInput}
                                 placeholder="Last Name"
                                 onChangeText={handleChange('lastName')}
                                 onBlur={handleBlur('lastName')}
                                 value={values.lastName}/>
                      <ErrorMessage errorValue={touched.lastName && errors.lastName}/>
                    </View>
                  </View>

                  <TextInput style={styles.textInput}
                             placeholder="Email"
                             onChangeText={handleChange('email')}
                             onBlur={handleBlur('email')}/>
                  <ErrorMessage errorValue={touched.email && errors.email}/>

                  <TextInput style={styles.textInput}
                             placeholder="Username"
                             onChangeText={handleChange('username')}
                             onBlur={handleBlur('username')}/>
                  <ErrorMessage errorValue={touched.username && errors.username}/>

                  <TextInput style={styles.textInput}
                             placeholder="Password"
                             onChangeText={handleChange('password')}
                             onBlur={handleBlur('password')}
                             secureTextEntry={true}/>
                  <ErrorMessage errorValue={touched.password && errors.password}/>

                  <TouchableOpacity onPress={handleSubmit} disabled={!isValid || isSubmitting}>
                    <Text style={styles.registerButton}>
                      Register
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>

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
    padding: 5,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'grey',
    minWidth: 275,
    textAlign: 'left'
  },
  textNameInput: {
    margin: 8,
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: 'grey',
    minWidth: 175,
    textAlign: 'left'
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
