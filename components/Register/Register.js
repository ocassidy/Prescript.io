import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import firebase from "../../firebaseConfig.js";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      error: false,
      errorMessage: ''
    }
  }

  handleRegister = () => {
    const {firstName, lastName, email, username, password} = this.state;

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.props.navigation.navigate('Login');
      })
      .catch((error) => {
        this.setState({errorMessage: error.message, error: true})
      });

    // if (!this.state.error) {
    //   firebase
    //     .database()
    //     .ref('users/')
    //     .set({
    //       firstName,
    //       lastName,
    //       email,
    //       username
    //     })
    //     .then((response) => {
    //       console.log('response ', response)
    //     }).catch((error) => {
    //     console.log('error ', error)
    //   })
    // }
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={styles.appTitle}>
          Prescript.io
        </Text>
        <Text style={styles.appText}>
          Your Prescription Management App
        </Text>
        <Text style={styles.pageTitle}>
          Register
        </Text>

        <View style={styles.firstNameLastNameInRow}>
          <View>
            <Text style={styles.appText}>First Name</Text>
            <TextInput style={styles.textNameInput} onChangeText={text => this.setState({firstName: text})}/>
          </View>

          <View>
            <Text style={styles.appText}>Last Name</Text>
            <TextInput style={styles.textNameInput} onChangeText={text => this.setState({lastName: text})}/>
          </View>
        </View>

        <Text style={styles.appText}>Email</Text>
        <TextInput style={styles.textInput} onChangeText={text => this.setState({email: text})}/>

        <Text style={styles.appText}>Username</Text>
        <TextInput style={styles.textInput} onChangeText={text => this.setState({username: text})}/>

        <Text style={styles.appText}>Password</Text>
        <TextInput style={styles.textInput} onChangeText={text => this.setState({password: text})}
                   secureTextEntry={true}/>

        <TouchableOpacity onPress={this.handleRegister}>
          <Text style={styles.registerButton}>
            Register
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigate('Login')}>
          <Text style={styles.loginButton}>
            Have an account? Login Here
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    textAlign: 'center',
    justifyContent: 'center',
    textAlignVertical: "center",
    alignItems: 'center'
  },
  appTitle: {
    marginTop: 10,
    fontSize: 30,
    padding: 10
  },
  pageTitle: {
    fontSize: 26,
    padding: 10
  },
  appText: {
    fontSize: 20,
    padding: 10,
    textAlign: 'center'
  },
  textInput: {
    fontSize: 20,
    padding: 10,
    borderColor: 'grey',
    borderWidth: 1,
    minWidth: 275,
    textAlign: 'center'
  },
  textNameInput: {
    margin: 8,
    fontSize: 20,
    padding: 10,
    borderColor: 'grey',
    borderWidth: 1,
    minWidth: 175,
    textAlign: 'center'
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
  firstNameLastNameInRow: {
    flexDirection: 'row'
  }
});
