import React, {Component} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  YellowBox,
} from 'react-native';
import firebase from "../../firebaseConfig.js";
import {Formik} from "formik";
import * as Yup from 'yup';
import {ErrorMessage} from "../common/ErrorMessage";
import {
  Button,
  Text,
  TextInput
} from 'react-native-paper';
import {NavigationActions, StackActions} from 'react-navigation'
import IsLoadingSpinner from "../common/IsLoadingSpinner";
import styles from '../themes/styles';
import {Notifications} from 'expo';
import * as Permissions from 'expo-permissions';

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

  resetStack = () => {
    this.props
      .navigation
      .dispatch(StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'AppStack',
          }),
        ],
        key: null
      }))
  };

  handleLogin = (values) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(values.email.trim(), values.password.trim())
      .then((user) => {
        this.setState({
          error: false,
        });
        // this.registerUserForPushNotifications(user)
        //   .then(r => this.props.navigation.navigate('Profile'))
        //   .catch(error => console.log(error));
        this.props.navigation.navigate('Profile');
        this.props.navigation.dispatch(this.resetStack);
      })
      .catch((error) => {
        this.setState({errorMessage: error.message, error: true})
      });
  };

  registerUserForPushNotifications = async (user) => {
    const {status: existingStatus} = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return;
    }

    let token = await Notifications.getExpoPushTokenAsync();

    firebase
      .database()
      .ref('users/' + user.user.uid)
      .update({
        expoToken: token
      })
      .then(response => {
        console.log('registerUserForPushNotifications update response ', response);
      }).catch((error) => {
      console.log('registerUserForPushNotifications update error ', error.message);
    });
  };

  render() {
    const {theme, navigation} = this.props;
    const {isLoading, authenticated, errorMessage, error} = this.state;
    this.emailTextInput = React.createRef();
    this.passwordTextInput = React.createRef();
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null} enabled>
        {isLoading && !authenticated
          ? <IsLoadingSpinner/>
          : <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inner}>
              <Text style={styles.appTitle} theme={theme}>Prescript.io</Text>
              <Text style={styles.appText} theme={theme}>Your Prescription Management App </Text>
              <Text style={styles.pageTitle} theme={theme}>Login</Text>
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
                    <TextInput
                      theme={theme}
                      placeholder="Email"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      mode='outlined'
                      ref={this.emailTextInput}
                    />
                    <ErrorMessage errorValue={touched.email && errors.email}/>

                    <TextInput
                      theme={theme}
                      placeholder="Password"
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      maxLength={24}
                      value={values.password}
                      secureTextEntry={true}
                      mode='outlined'
                      refs={this.passwordTextInput}
                    />
                    <ErrorMessage errorValue={touched.password && errors.password}/>

                    {error ? <ErrorMessage errorValue={errorMessage}/> : undefined}
                    <Button theme={theme}
                            onPress={handleSubmit}
                            mode="contained"
                            labelStyle={styles.buttonTextColour}>
                      Login
                    </Button>
                    {error ? <ErrorMessage errorValue={error.message}/> : undefined}
                  </View>
                )}
              </Formik>

              <Button style={styles.buttonSpacing} theme={theme} onPress={() => navigation.navigate('Register')}>
                Don't have an account? Register Here
              </Button>

              <Button style={styles.buttonSpacing} theme={theme} onPress={() => navigation.navigate('ResetPassword')}>
                Forgot Password?
              </Button>

              {navigation.state.params && navigation.state.params.signOutMessage !== undefined
                ? <Text style={styles.loggedOutText} theme={theme}>{navigation.state.params.signOutMessage}</Text>
                : undefined}
            </View>
          </TouchableWithoutFeedback>}
      </KeyboardAvoidingView>
    )
  }
}
