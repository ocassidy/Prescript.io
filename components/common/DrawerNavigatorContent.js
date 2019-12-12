import React, {Component} from 'react';
import {ScrollView} from "react-native";
import {SafeAreaView} from "react-navigation";
import {Button} from "react-native-paper";
import styles from '../themes/styles'
import {signOut} from "./utils";

console.disableYellowBox = true;
export class DrawerNavigatorContent extends Component {
  render() {
    const {theme, navigation} = this.props;
    return (
      <SafeAreaView style={styles.container} forceInset={{top: "always", horizontal: "never"}}>
        <ScrollView>
          <Button theme={theme}
                  onPress={() => this.props.navigation.navigate('Profile')}
                  style={styles.drawerButtonSpacing}
                  icon='account'>
            Profile
          </Button>

          <Button theme={theme}
                  onPress={() => this.props.navigation.navigate('Reminders')}
                  style={styles.drawerButtonSpacing}
                  icon='calendar'>
            Reminders
          </Button>
          <Button theme={theme}
                  onPress={() => this.props.navigation.navigate('Prescriptions')}
                  style={styles.drawerButtonSpacing}
                  icon='pill'>
            Prescriptions
          </Button>
          <Button theme={theme}
                  onPress={() => this.props.navigation.navigate('Gallery')}
                  style={styles.drawerButtonSpacing}
                  icon='image'>
            Gallery
          </Button>
        </ScrollView>
        <Button icon='logout'
                style={styles.drawerButtonSpacing}
                onPress={() => signOut(navigation, 'You have logged out.')}>
          Logout
        </Button>
      </SafeAreaView>
    );
  }
};
