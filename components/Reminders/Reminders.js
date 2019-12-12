import React, {Component} from 'react';
import {View} from 'react-native'
import {Button, Text} from 'react-native-paper';
import {Agenda} from 'react-native-calendars';
import styles from "../themes/styles";
import moment from "moment";
import * as firebase from "firebase";
import {db} from "../../firebaseConfig";
import AddReminderModal from "./AddReminderModal";
import DeleteReminderModal from "./DeleteReminderModal";

console.disableYellowBox = true;
export default class Reminders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: null,
      today: moment().format('YYYY-MM-DD'),
      addEditReminderModalVisible: false,
      modalSuccessTextVisible: false,
      deleteItemSuccess: false,
      deleteItemSuccessText: '',
      selectedAgendaItem: null
    };
  }

  componentDidMount() {
    this.loadItems();
  }

  loadItems = () => {
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
      db.collection('users')
        .doc(user.uid)
        .set({
          reminders: {
            [pickedDate]: [values],
          }
        }, {merge: true})
        .then(response => {
          this.setState({
            modalSuccessTextVisible: true
          });
          this.loadItems();
          console.log('successful add of reminder(s) on user id', user.uid)
        })
        .catch(error => console.log('unsuccessful add of add of reminder(s) to user', user.uid, 'with', error));
    } else {
      this.setState({
        error: true,
        errorMessage: 'Invalid Data'
      });
    }
  };

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  setAddEditReminderModalVisible = (visible) => {
    if (visible) {
      this.setState({addEditReminderModalVisible: true, modalSuccessTextVisible: false});
    } else {
      this.setState({addEditReminderModalVisible: false, modalSuccessTextVisible: false});
    }
  };

  setDeleteReminderModalVisible = (visible) => {
    if (visible) {
      this.setState({deleteReminderModalVisible: true, modalSuccessTextVisible: false});
    } else {
      this.setState({deleteReminderModalVisible: false, modalSuccessTextVisible: false});
    }
  };

  handleDeleteReminder = (date) => {
    let user = firebase.auth().currentUser;

    db.collection('users')
      .doc(user.uid)
      .set({
        reminders: {
          [date]: firebase.firestore.FieldValue.delete()
        }
      }, {merge: true})
      .then(response => {
        this.setState({
          deleteItemSuccess: true,
          deleteItemSuccessText: 'Successfully deleted item'
        });
        this.setDeleteReminderModalVisible(false);
        this.loadItems();
        console.log('successful delete of reminder', date, 'on user id', user.uid)
      })
      .catch(error => console.log('unsuccessful delete of reminder', date, 'on user id', user.uid, 'with', error));
  };

  renderItem(item) {
    const {medicine, medicine2, medicine3, reminderNote} = item;
    const {theme} = this.props;
    return (
      <View style={styles.agendaItem}>
        <Text theme={theme} style={styles.agendaItemInner}>Medicine: {medicine}</Text>
        {medicine2 ? <Text theme={theme} style={styles.agendaItemInner}>Medicine 2: {medicine2}</Text> : undefined}
        {medicine3 ? <Text theme={theme} style={styles.agendaItemInner}>Medicine 3: {medicine3}</Text> : undefined}
        <Text theme={theme} style={styles.agendaItemInner}>Note: {reminderNote}</Text>
      </View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.agendaEmptyDate}>
        <Text theme={this.props.theme} style={styles.agendaItemInner}>There are no events on this date</Text>
      </View>
    );
  }

  render() {
    const {theme} = this.props;
    const {today, items, modalSuccessTextVisible, addEditReminderModalVisible, deleteReminderModalVisible} = this.state;
    return (
      <View style={styles.container}>
        <Agenda
          items={items}
          loadItemsForMonth={this.loadItems.bind(this)}
          selected={today}
          renderItem={(item) => this.renderItem(item)}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          renderEmptyData={this.renderEmptyDate.bind(this)}
        />

        {addEditReminderModalVisible
          ? <AddReminderModal
            handleAddReminder={this.handleAddReminder}
            modalSuccessTextVisible={modalSuccessTextVisible}
            setModalVisible={() => this.setAddEditReminderModalVisible()}
            animationType="fade"
            transparent={false}
            onRequestClose={() => this.setAddEditReminderModalVisible()}>
          </AddReminderModal>
          : null}

        {deleteReminderModalVisible
          ? <DeleteReminderModal
            handleDeleteReminder={this.handleDeleteReminder}
            modalSuccessTextVisible={modalSuccessTextVisible}
            setModalVisible={() => this.setDeleteReminderModalVisible()}
            animationType="fade"
            transparent={false}
            onRequestClose={() => this.setDeleteReminderModalVisible()}
            savedDates={items}>
          </DeleteReminderModal>
          : null}

        <View style={styles.inner}>
          {this.state.deleteItemSuccess === true ?
            <Text style={styles.appText}>{this.state.deleteItemSuccessText}</Text> : null}
          <Button theme={theme}
                  onPress={() => this.setAddEditReminderModalVisible(true)}>
            Add Reminder
          </Button>

          <Button theme={theme}
                  onPress={() => this.setDeleteReminderModalVisible(true)}
                  mode='contained'
                  color={'red'}
                  labelStyle={styles.buttonTextColour}>
            Delete Reminder
          </Button>
        </View>
      </View>
    );
  }
}
