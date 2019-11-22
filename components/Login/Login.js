import React, {Component} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  YellowBox, Alert
} from 'react-native';
import firebase from "../../firebaseConfig.js";
import {TouchableWithoutFeedback} from "react-native-web";
import {Formik} from "formik";
import * as Yup from 'yup';
import {ErrorMessage} from "../common/ErrorMessage";

const LoginSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password must have at least 6 characters')
    .max(50, 'Password must not be more than 50 characters')
    .required('Required'),
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
      error: false,
      errorMessage: '',
      isLoading: true,
      authenticated: false,
      user: null
    }
  }

  componentDidMount() {
    this.authFirebaseListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true,
          isLoading: false,
          user: user
        });
        this.props.navigation.navigate('Profile')
      } else {
        this.setState({
          authenticated: false,
          isLoading: false,
        });
      }
    });
  };

  componentWillUnmount() {
    this.authFirebaseListener && this.authFirebaseListener()
  }

  handleLogin = (values) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(values.email.trim(), values.password.trim())
      .then(() => {
        this.props.navigation.navigate('Profile')
      })
      .catch((error) => {
        this.setState({errorMessage: error.message, error: true})
      });
  };

  render() {
    const {navigate} = this.props.navigation;
    let {isLoading, authenticated} = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null} enabled>
        {isLoading && !authenticated ?
          <View style={styles.spinner}>
            <ActivityIndicator size="large" color="black"/>
            <Text>Loading Please Wait...</Text>
          </View> :
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inner}>
              <Text style={styles.appTitle}>
                Prescript.io
              </Text>
              <Text style={styles.appText}>
                Your Prescription Management App
              </Text>
              <Text style={styles.pageTitle}>
                Login
              </Text>
              <Formik initialValues={{email: '', password: ''}}
                      onSubmit={values => this.handleLogin(values)}
                      validationSchema={LoginSchema}>
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
                    <TextInput style={styles.textInput}
                               placeholder="Email"
                               onChangeText={handleChange('email')}
                               onBlur={handleBlur('email')}
                               value={values.email}
                               maxLength={50}
                    />
                    <ErrorMessage errorValue={touched.email && errors.email}/>

                    <TextInput style={styles.textInput}
                               placeholder="Password"
                               onChangeText={handleChange('password')}
                               onBlur={handleBlur('password')}
                               maxLength={24}
                               value={values.password}
                               secureTextEntry={true}
                    />
                    <ErrorMessage errorValue={touched.password && errors.password}/>

                    <TouchableOpacity onPress={handleSubmit} disabled={!isValid || isSubmitting}>
                      <Text style={styles.loginButton}>
                        Login
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Formik>

              <TouchableOpacity onPress={() => navigate('Register')}>
                <Text style={styles.registerButton}>
                  Don't have an account? Register Here
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigate('ResetPassword')}>
                <Text style={styles.registerButton}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>}
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
  spinner: {
    marginTop: 350,
    marginBottom: 15,
    padding: 20,
    textAlign: 'center',
    justifyContent: 'center',
    textAlignVertical: "center",
    alignItems: 'center'
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
  loginButton: {
    fontSize: 20,
    margin: 10,
    padding: 10,
    color: 'white',
    backgroundColor: '#44a2ff',
    minWidth: 100,
    textAlign: 'center'
  },
  registerButton: {
    fontSize: 20,
    margin: 10,
    padding: 10,
    color: '#44a2ff',
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
  }
});
