import React, {Component} from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import {Button, Text} from 'react-native-paper';
import styles from '../themes/styles';
import RadioForm from "react-native-simple-radio-button";

console.disableYellowBox = true;
export default class AddEditReminderModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorMessage: '',
      radioButtonObjects: [],
      selected: 0,
      noRemindersExist: true
    }
  }

  componentDidMount() {
    const {savedDates} = this.props;

    if (Object.keys(savedDates).length > 0) {
      const savedDateKeys = Object.keys(savedDates);
      const buildRadioButtonsObjects = savedDateKeys.map((date, index) => ({label: date, value: index}));

      this.setState({
        radioButtonObjects: buildRadioButtonsObjects,
        noRemindersExist: false
      });
    } else {
      this.setState({
        noRemindersExist: true
      });
    }
  }

  getSelectedDateToDelete = () => {
    let result = this.state.radioButtonObjects.filter((obj) => {
      return obj.value === this.state.selected;
    });

    if (result) {
      Alert.alert(
        'Confirm',
        'Are you sure you wish to delete your ' + result[0].label + ' reminder?',
        [
          {text: 'Yes', onPress: () => this.props.handleDeleteReminder(result[0].label)},
          {text: 'No'}
        ],
        {cancelable: false}
      )
    }
  };

  render() {
    const {theme, setModalVisible, visible} = this.props;
    const {radioButtonObjects} = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null} enabled>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentComponentStyle={{flex: 1}}>
            <View style={styles.inner}>
              <Modal
                animationType="fade"
                transparent={false}
                visible={visible}
                onRequestClose={() => {
                  setModalVisible(false)
                }}>
                <View style={styles.inner}>
                  <View>
                    {this.state.noRemindersExist
                      ? <Text style={styles.modalText}>You have no reminders to delete</Text>
                      :
                      <Text style={styles.modalText}>You can delete a Reminder by selecting a saved date below.</Text>}

                    <ScrollView contentContainerStyle={styles.deleteReminderModalInnerScroll}>
                      <RadioForm
                        radio_props={radioButtonObjects}
                        initial={0}
                        onPress={(value) => {
                          this.setState({selected: value})
                        }}
                      />
                    </ScrollView>

                    <Button theme={theme}
                            onPress={() => this.getSelectedDateToDelete()}
                            mode='contained'
                            color={'red'}
                            labelStyle={styles.buttonTextColour}
                            disabled={this.state.noRemindersExist}>
                      Delete Reminder
                    </Button>

                    <Button onPress={() => {
                      setModalVisible(false)
                    }}>
                      Close
                    </Button>
                  </View>
                </View>
              </Modal>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    )
  }
}
