import React, {Component} from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack'
import {createDrawerNavigator} from 'react-navigation-drawer';
import {View, Image, YellowBox, Text, TouchableOpacity} from 'react-native'
import {AppLoading, SplashScreen,} from 'expo';
import {Asset} from "expo-asset";
import {Provider as PaperProvider, IconButton, Button} from 'react-native-paper';
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Profile from "./components/Profile/Profile";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import CustomTheme from './components/themes/CustomTheme';
import Reminders from './components/Reminders/Reminders'
import {DrawerNavigatorContent} from "./components/common/DrawerNavigatorContent";
import Prescriptions from "./components/Prescriptions/Prescriptions";
import Camera from "./components/camera/Camera"
import Gallery from "./components/camera/Gallery";
import styles from "./components/themes/styles";

const AppStack = createStackNavigator(
  {
    Profile: {
      screen: Profile,
      navigationOptions: ({navigation}) => ({
        title: 'Profile',
        headerLeft: <IconButton icon='menu' color='black' size={38} onPress={() => navigation.toggleDrawer()}/>
      })
    },
    Reminders: {
      screen: Reminders,
      navigationOptions: ({navigation}) => ({
        title: 'Reminders',
        headerLeft: <IconButton icon='menu' color='black' size={38} onPress={() => navigation.toggleDrawer()}/>
      })
    },
    Prescriptions: {
      screen: Prescriptions,
      navigationOptions: ({navigation}) => ({
        title: 'Prescriptions',
        headerLeft: <IconButton icon='menu' color='black' size={38} onPress={() => navigation.toggleDrawer()}/>
      })
    },
    Camera: {
      screen: Camera,
      navigationOptions: {
        header: null
      }
    },
    Gallery: {
      screen: Gallery,
      navigationOptions: ({navigation}) => ({
        title: 'Gallery',
        headerLeft: <IconButton icon='menu' color='black' size={38} onPress={() => navigation.toggleDrawer()}/>,
      })
    },
  },
);

const DrawerNavigator = createDrawerNavigator(
  {
    Drawer: {
      screen: AppStack,
    },
  },
  {
    drawerWidth: 175,
    drawerPosition: 'left',
    contentComponent: DrawerNavigatorContent,
    initialRouteName: 'Drawer',
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

const RootStack = createStackNavigator(
  {
    AuthStack: {
      screen: AuthSwitch,
      navigationOptions: {
        header: null
      }
    },
    DrawerNavigator: {
      screen: DrawerNavigator,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: "AuthStack",
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
