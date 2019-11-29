import React, {Component} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Modal,
  YellowBox
} from 'react-native'
import {
  Text,
  TextInput,
  Button,
  Divider
} from 'react-native-paper';
import {Formik} from "formik";
import * as Yup from 'yup';
import {ErrorMessage} from "../common/ErrorMessage";
import styles from '../themes/styles';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";

const ModalSchema = Yup.object().shape({
  medicine: Yup.string()
    .label('medicine')
    .min(4)
    .required('Required'),
  medicine2: Yup.string()
    .label('medicine2')
    .min(4),
  medicine3: Yup.string()
    .label('medicine3')
    .min(4),
  reminderNote: Yup.string()
    .label('reminderNote')
    .min(4)
    .required('Required')
});


YellowBox.ignoreWarnings(['Setting a timer']);
export default class AddReminderModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorMessage: '',
      isDateTimePickerVisible: false,
      pickedDate: ''
    }
  }

  showDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: true});
  };

  hideDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: false});
  };

  handleDatePicked = date => {
    this.setState({
      pickedDate: moment(date).format('YYYY-MM-DD')
    });
    this.hideDateTimePicker();
  };

  render() {
    const {theme, setModalVisible, visible, modalSuccessTextVisible, handleAddReminder} = this.props;
    const {pickedDate} = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null} enabled>
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
                <Text style={styles.modalText}>You can add a Reminder with a Medicine below.</Text>
                <Text style={styles.modalText}>Please use the choose date button to choose a date.</Text>

                <Formik initialValues={{medicine: '', medicine2: '', medicine3: '', reminderNote: ''}}
                        onSubmit={values => handleAddReminder(values, pickedDate)}
                        validationSchema={ModalSchema}>
                  {({
                      handleChange,
                      values,
                      handleSubmit,
                      errors,
                      isValid,
                      touched,
                      handleBlur,
                      isSubmitting
                    }) => (
                    <View>
                      <Divider/>
                      <Text theme={theme} style={styles.modalText}>{pickedDate ? pickedDate : 'No Date Selected'}</Text>
                      <Divider/>
                      <Button theme={theme}
                              style={styles.buttonSpacing}
                              onPress={this.showDateTimePicker}>Choose Date</Button>

                      <TextInput
                        theme={theme}
                        placeholder="Medicine"
                        onChangeText={handleChange('medicine')}
                        onBlur={handleBlur('medicine')}
                        value={values.medicine}
                        mode='outlined'
                      />
                      <ErrorMessage errorValue={touched.medicine && errors.medicine}/>

                      <TextInput
                        theme={theme}
                        placeholder="2nd Medicine (Optional)"
                        onChangeText={handleChange('medicine2')}
                        onBlur={handleBlur('medicine2')}
                        value={values.medicine2}
                        mode='outlined'
                      />
                      <ErrorMessage errorValue={touched.medicine2 && errors.medicine2}/>

                      <TextInput
                        theme={theme}
                        placeholder="3rd Medicine (Optional)"
                        onChangeText={handleChange('medicine3')}
                        onBlur={handleBlur('medicine3')}
                        value={values.medicine3}
                        mode='outlined'
                      />
                      <ErrorMessage errorValue={touched.medicine3 && errors.medicine3}/>

                      <TextInput
                        theme={theme}
                        placeholder="Reminder Note"
                        onChangeText={handleChange('reminderNote')}
                        onBlur={handleBlur('reminderNote')}
                        value={values.reminderNote}
                        mode='outlined'
                        numberOfLines={4}
                      />
                      <ErrorMessage errorValue={touched.reminderNote && errors.reminderNote}/>

                      <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this.handleDatePicked}
                        onCancel={this.hideDateTimePicker}
                      />

                      <Button theme={theme} onPress={handleSubmit}
                              mode="contained"
                              style={styles.buttonSpacing}
                              labelStyle={styles.buttonTextColour}>
                        Save
                      </Button>
                      {modalSuccessTextVisible ?
                        <Text style={styles.appText}>Successfully added this reminder. Press close to return to your
                          reminders.</Text>
                        : undefined}
                    </View>
                  )}
                </Formik>

                <Button onPress={() => {
                  setModalVisible(false)
                }}>
                  Close
                </Button>
              </View>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    )
  }
}
