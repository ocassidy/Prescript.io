import React, {Component} from 'react';
import {View, YellowBox} from 'react-native'
import {Button, Text} from 'react-native-paper';
import {Agenda} from 'react-native-calendars';
import styles from "../themes/styles";
import moment from "moment";
import * as firebase from "firebase";
import {db} from "../../firebaseConfig";
import AddReminderModal from "./AddReminderModal";

YellowBox.ignoreWarnings(['Setting a timer']);
export default class Reminders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      today: null,
      addReminderModalVisible: false,
      modalSuccessTextVisible: false,
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
        this.setState({
          items: document.get('reminders')
        })
      })
      .catch(error => {
        console.log('failed to retrieve reminder items', error.message)
      });
  };

  handleAddReminder = (values, pickedDate) => {
    let user = firebase.auth().currentUser;
    let {medicine} = values;
    if (pickedDate !== '' && pickedDate !== null && medicine) {
      let reminders = {
        [pickedDate]: [values],
      };
      let data = {
        reminders
      };

      db.collection('users')
        .doc(user.uid)
        .set(data, {merge: true})
        .then(response => {
          this.setState({
            modalSuccessTextVisible: true
          });
          console.log('successful add of reminder(s) on user id', user.uid)
        })
        .catch(error => console.log('unsuccessful add of add of reminder(s) to user', user.uid, 'with', error));
    } else {
      this.setState({
        error: true,
        errorMessage: 'Invalid Data'
      });
    }
    this.loadItems();
  };

  renderItem(items) {
    const {medicine, medicine2, medicine3, reminderNote} = items;
    const {theme} = this.props;
    return (
      <View style={styles.agendaItem}>
        <Text theme={theme} style={styles.agendaItemText}>Medicine: {medicine}</Text>
        {medicine2 ? <Text theme={theme} style={styles.agendaItemText}>Medicine 2: {medicine2}</Text> : undefined}
        {medicine3 ? <Text theme={theme} style={styles.agendaItemText}>Medicine 3: {medicine3}</Text> : undefined}
        <Text theme={theme} style={styles.agendaItemText}>Note: {reminderNote}</Text>
        <View style={styles.agendaItemButtonView}>
          <Button theme={theme} style={styles.agendaButtonText}
                  onPress={() => this.editAgendaItem}>Edit</Button>
          <Button theme={theme} style={styles.agendaButtonText}
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

  setAddReminderModalVisible = (visible) => {
    if (visible) {
      this.setState({addReminderModalVisible: true, modalSuccessTextVisible: false});
    } else {
      this.setState({addReminderModalVisible: false, modalSuccessTextVisible: false});
    }
  };

  editAgendaItem = (item) => {

  };

  deleteAgendaItem = (item) => {

  };

  render() {
    const {theme} = this.props;
    const {addReminderModalVisible} = this.state;
    return (
      <View style={{flex: 1}}>
        <Agenda
          items={this.state.items}
          loadItemsForMonth={this.loadItems.bind(this)}
          selected={this.state.today}
          renderItem={this.renderItem.bind(this)}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          renderEmptyData={this.renderEmptyDate.bind(this)}
        />

        {addReminderModalVisible
          ? <AddReminderModal
            handleAddReminder={this.handleAddReminder}
            modalSuccessTextVisible={this.state.modalSuccessTextVisible}
            setModalVisible={() => this.setAddReminderModalVisible()}
            animationType="fade"
            transparent={false}
            onRequestClose={() => this.setAddReminderModalVisible()}>
          </AddReminderModal>
          : undefined}

        <Button theme={theme} style={styles.addReminderText} onPress={() => this.setAddReminderModalVisible(true)}>Add
          Reminder</Button>
      </View>
    );
  }
}
