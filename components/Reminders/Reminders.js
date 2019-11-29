import React, {Component} from 'react';
import {View, YellowBox} from 'react-native'
import {Button, Text} from 'react-native-paper';
import {Agenda} from 'react-native-calendars';
import styles from "../themes/styles";
import moment from "moment";
import * as firebase from "firebase";
import {db} from "../../firebaseConfig";

YellowBox.ignoreWarnings(['Setting a timer']);
export default class Reminders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      today: null
    };
  }

  componentDidMount() {
    this.setState({
      today: moment()
    });
    this.loadItems();
  }

  loadItems = (day) => {
    let user = firebase.auth().currentUser;

    db.collection('users')
      .doc(user.uid)
      .get()
      .then(document => {
        const {reminders} = document._document.proto.fields;
        this.setState({
          items: this.parseReminderData(reminders)
        })
      })
      .catch(error => {
        console.log('failed to retrieve reminder items', error.message)
      });
  };

  parseReminderData = (data) => {
    const {values} = data.arrayValue;
    values.forEach(mapValue => {
      console.log(JSON.stringify(mapValue))
    })
  };

  renderItem(items) {
    console.log('items', items);
    return (
      <View style={styles.agendaItem}>
        <Text theme={this.props.theme} style={styles.agendaItemText}>{items}</Text>
        <View style={styles.agendaItemButtonView}>
          <Button theme={this.props.theme} style={styles.agendaButtonText}
                  onPress={() => this.editAgendaItem}>Edit</Button>
          <Button theme={this.props.theme} style={styles.agendaButtonText}
                  onPress={() => this.deleteAgendaItem}>Delete</Button>
        </View>
      </View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.agendaEmptyDate}>
        <Text theme={this.props.theme} style={styles.agendaItemText}>There are no events on this date</Text>
      </View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  handleAddReminder = () => {
    let user = firebase.auth().currentUser;

    this.addReminder(user);
  };

  addReminder = (user) => {

  };

  editAgendaItem = (item) => {

  };

  deleteAgendaItem = (item) => {

  };

  render() {
    const {theme} = this.props;
    return (
      <View style={{flex: 1}}>
        <Agenda
          items={this.state.items}
          loadItemsForMonth={this.loadItems.bind(this)}
          selected={this.state.today}
          renderItem={this.renderItem.bind(this)}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          onDayPress={day => {
            console.log("selected day", day)
          }}
        />

        <Button theme={theme} style={styles.addReminderText} onPress={() => this.handleAddReminder}>Add
          Reminder</Button>
      </View>
    );
  }
}
