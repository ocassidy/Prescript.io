import React, {Component} from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack'
import {createDrawerNavigator} from 'react-navigation-drawer';
import {View, Image, YellowBox} from 'react-native'
import {AppLoading, SplashScreen,} from 'expo';
import {Asset} from "expo-asset";
import {Provider as PaperProvider, IconButton} from 'react-native-paper';
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Profile from "./components/Profile/Profile";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import CustomTheme from './components/themes/CustomTheme';
import Reminders from './components/Reminders/Reminders'
import {DrawerNavigatorContent} from "./components/common/DrawerNavigatorContent";

const DrawerNavigator = createDrawerNavigator(
  {
    Profile: {
      screen: Profile,
    },
    Reminders: {
      screen: Reminders,
    },
  },
  {
    drawerWidth: 250,
    drawerPosition: 'left',
    initialRouteName: 'Profile',
    contentComponent: DrawerNavigatorContent
  });

const AuthSwitch = createSwitchNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: {
        header: null
      }
    },
    Register: {
      screen: Register,
      navigationOptions: {
        header: null
      }
    },
    ResetPassword: {
      screen: ResetPassword,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: "Login",
  }
);

const AppStack = createStackNavigator(
  {
    Profile: {
      screen: DrawerNavigator,
      navigationOptions: ({navigation}) => ({
        headerLeft: <IconButton icon='menu' color='black' size={38} onPress={() => navigation.toggleDrawer()}/>
      })
    },
    Reminders: {
      screen: Reminders,
      navigationOptions: ({navigation}) => ({
        headerLeft: <IconButton icon='menu' color='black' size={38} onPress={() => navigation.toggleDrawer()}/>
      })
    },
  },
  {
    initialRouteName: "Profile",
  }
);

const RootStack = createStackNavigator(
  {
    AuthStack: AuthSwitch,
    AppStack: AppStack
  },
  {
    initialRouteName: "AuthStack",
    headerMode: 'none'
  }
);

const AppContainer = createAppContainer(RootStack);

const theme = {
  ...CustomTheme,
};

YellowBox.ignoreWarnings(['Setting a timer for a long']);
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSplashReady: false,
      isAppReady: false,
    }
  }

  render() {
    if (!this.state.isSplashReady) {
      return (
        <AppLoading
          startAsync={this._cacheSplashResourcesAsync}
          onFinish={() => this.setState({isSplashReady: true})}
          onError={console.warn}
          autoHideSplash={false}
        />
      );
    }

    if (!this.state.isAppReady) {
      return (
        <View style={{flex: 1}}>
          <Image
            source={require('./assets/splash.gif')}
            onLoad={this._cacheResourcesAsync}
          />
        </View>
      );
    }

    return (
      <PaperProvider theme={theme}>
        <AppContainer/>
      </PaperProvider>
    );
  }

  _cacheSplashResourcesAsync = async () => {
    const gif = require('./assets/splash.gif');
    return Asset.fromModule(gif).downloadAsync();
  };

  _cacheResourcesAsync = async () => {
    SplashScreen.hide();
    const images = [
      require('./assets/splash.gif'),
      require('./assets/still-splash.png'),
    ];

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });

    await Promise.all(cacheImages);
    this.setState({isAppReady: true});
  };
}
