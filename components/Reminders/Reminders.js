import React, {Component} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  YellowBox,
} from 'react-native'
import {
  Text,
  Button
} from 'react-native-paper';
import styles from '../themes/styles';
import * as Calendar from 'expo-calendar';
import * as Permissions from 'expo-permissions';
import {Calendar as RNCalendar, CalendarList, Agenda} from 'react-native-calendars';
import moment from "moment";

YellowBox.ignoreWarnings(['Setting a timer']);
export default class Reminders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorMessage: '',
    }
  }

  componentDidMount = async () => {
    const { status } = await Permissions.askAsync(Permissions.CALENDAR);
    if (status === 'granted') {
      const calendars = await Calendar.getCalendarsAsync();
    }
  };

  // findCalendars = async () => {
  //   const calendars = await Calendar.getCalendarsAsync();
  //
  //   return calendars;
  // };
  //
  // createNewCalendar = async () => {
  //   const calendars = await this.findCalendars();
  //   const newCalendar = {
  //     title: 'test',
  //     entityType: Calendar.EntityTypes.EVENT,
  //     color: '#2196F3',
  //     sourceId:
  //       Platform.OS === 'ios'
  //         ? calendars.find(cal => cal.source && cal.source.name === 'Default')
  //           .source.id
  //         : undefined,
  //     source:
  //       Platform.OS === 'android'
  //         ? {
  //           name: calendars.find(
  //             cal => cal.accessLevel === Calendar.CalendarAccessLevel.OWNER
  //           ).source.name,
  //           isLocalAccount: true,
  //         }
  //         : undefined,
  //     name: 'test',
  //     accessLevel: Calendar.CalendarAccessLevel.OWNER,
  //     ownerAccount:
  //       Platform.OS === 'android'
  //         ? calendars.find(
  //         cal => cal.accessLevel === Calendar.CalendarAccessLevel.OWNER
  //         ).ownerAccount
  //         : undefined,
  //   };
  //
  //   let calendarId = null;
  //
  //   try {
  //     calendarId = await Calendar.createCalendarAsync(newCalendar);
  //   } catch (e) {
  //     Alert.alert(e.message);
  //   }
  //
  //   return calendarId;
  // };

  render() {
    const {theme} = this.props;
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null} enabled>
        <View style={styles.inner}>
          <Text style={styles.appText} theme={theme}>Your Reminders:</Text>
          <RNCalendar
            theme={theme}
            current={moment().format('YYYY-MM-DD')}
            // Handler which gets executed on day press. Default = undefined
            onDayPress={(day) => {console.log('selected day', day)}}
            // Handler which gets executed on day long press. Default = undefined
            onDayLongPress={(day) => {console.log('selected day', day)}}
            // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
            monthFormat={'yyyy MM'}
            // Handler which gets executed when visible month changes in calendar. Default = undefined
            onMonthChange={(month) => {console.log('month changed', month)}}
            // Hide month navigation arrows. Default = false
            hideArrows={true}
            // Replace default arrows with custom ones (direction can be 'left' or 'right')
            renderArrow={(direction) => (<Arrow />)}
            // Do not show days of other months in month page. Default = false
            hideExtraDays={true}
            // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
            // day from another month that is visible in calendar page. Default = false
            disableMonthChange={true}
            // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
            firstDay={1}
            // Hide day names. Default = false
            hideDayNames={true}
            // Show week numbers to the left. Default = false
            showWeekNumbers={true}
            // Handler which gets executed when press arrow icon left. It receive a callback can go back month
            onPressArrowLeft={substractMonth => substractMonth()}
            // Handler which gets executed when press arrow icon left. It receive a callback can go next month
            onPressArrowRight={addMonth => addMonth()}/>

          <Button style={styles.buttonSpacing} theme={theme} onPress={() => console.log('test')}>
            Add Reminder
          </Button>

          <Button style={styles.buttonSpacing} theme={theme} onPress={() => console.log('test')}>
            Remove Reminder
          </Button>
        </View>
      </KeyboardAvoidingView>
    )
  }
}
