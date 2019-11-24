import React, { Component } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  YellowBox,
} from 'react-native';
import firebase from "../../firebaseConfig.js";
import { Formik } from "formik";
import * as Yup from 'yup';
import { ErrorMessage } from "../common/ErrorMessage";
import {
  ActivityIndicator,
  Button,
  Text,
  TextInput
} from 'react-native-paper';
import { NavigationActions, StackActions } from 'react-navigation'
import styles from '../themes/styles';

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
    this.props.navigation.dispatch(this.resetStack);

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

  resetStack = () => {
    this.props
      .navigation
      .dispatch(StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'Profile',
            routeName: 'Register',
            routeName: 'ResetPassword'
          }),
        ],
        key: null
      }))
  }

  handleLogin = (values) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(values.email.trim(), values.password.trim())
      .then(() => {
        this.props.navigation.navigate('Profile')
      })
      .catch((error) => {
        this.setState({ errorMessage: error.message, error: true })
      });
  };

  render() {
    const { navigate } = this.props.navigation;
    const { theme } = this.props;
    const { isLoading, authenticated } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null} enabled>
        {isLoading && !authenticated ?
          <View style={styles.spinner}>
            <ActivityIndicator size="large" color="black" />
            <Text>Loading Please Wait...</Text>
          </View> :
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inner}>
              <Text style={styles.appTitle} theme={theme}>Prescript.io</Text>
              <Text style={styles.appText} theme={theme}>Your Prescription Management App </Text>
              <Text style={styles.pageTitle} theme={theme}>Login</Text>
              <Formik initialValues={{ email: '', password: '' }}
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
                      <TextInput
                        theme={theme}
                        placeholder="Email"
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                        mode='outlined'
                      />
                      <ErrorMessage errorValue={touched.email && errors.email} />

                      <TextInput
                        theme={theme}
                        placeholder="Password"
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        maxLength={24}
                        value={values.password}
                        secureTextEntry={true}
                        mode='outlined'
                      />
                      <ErrorMessage errorValue={touched.password && errors.password} />

                      <Button theme={theme} onPress={handleSubmit}
                        disabled={!isValid || isSubmitting}
                        mode="contained"
                        labelStyle={styles.buttonTextColour}>
                        Login
                      </Button>
                    </View>
                  )}
              </Formik>

              <Button style={styles.buttonSpacing} theme={theme} onPress={() => navigate('Register')}>
                Don't have an account? Register Here
              </Button>

              <Button style={styles.buttonSpacing} theme={theme} onPress={() => navigate('ResetPassword')}>
                Forgot Password?
              </Button>
            </View>
          </TouchableWithoutFeedback>}
      </KeyboardAvoidingView>
    )
  }
}