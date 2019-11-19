import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation';
import {createSwitchNavigator} from 'react-navigation'
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Profile from "./components/Profile/Profile";
import firebase from "./firebaseConfig";

const RootStack = createSwitchNavigator({
    Login: Login,
    Register: Register,
    Profile: Profile
  },
  {
    initialRouteName: 'Login',
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends Component {
  render() {
    return (
      <AppContainer/>
    );
  }
}
