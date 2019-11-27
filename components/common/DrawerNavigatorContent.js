import React, {Component} from 'react';
import {ScrollView} from "react-native";
import {SafeAreaView} from "react-navigation";
import {Button} from "react-native-paper";
import styles from '../themes/styles'
import {signOut} from "./utils";

export class DrawerNavigatorContent extends Component {
  render() {
    const {theme, navigation} = this.props;
    return (
      <SafeAreaView style={styles.container} forceInset={{top: "always", horizontal: "never"}}>
        <ScrollView>
          <Button theme={theme}
                  onPress={() => this.props.navigation.navigate('Profile', {title: 'Profile'})}
                  style={styles.buttonSpacing}
                  icon='account'>
            Profile
          </Button>

          <Button theme={theme}
                  onPress={() => this.props.navigation.navigate('Reminders', {title: 'Reminders'})}
                  style={styles.buttonSpacing}
                  icon='calendar'>
            Reminders
          </Button>
          <Button theme={theme}
                  onPress={() => this.props.navigation.navigate('Prescriptions', {title: 'Reminders'})}
                  style={styles.buttonSpacing}
                  icon='pill'>
            Prescriptions
          </Button>
        </ScrollView>
        <Button icon='logout' onPress={() => signOut(navigation, 'You have logged out.')}>Logout</Button>
      </SafeAreaView>
    );
  }
};
