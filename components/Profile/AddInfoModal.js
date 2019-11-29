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
  Button
} from 'react-native-paper';
import {Formik} from "formik";
import * as Yup from 'yup';
import {ErrorMessage} from "../common/ErrorMessage";
import styles from '../themes/styles';

const ModalSchema = Yup.object().shape({
  address: Yup.string()
    .label('Address')
    .min(4)
    .required('Required'),
  phoneNumber: Yup.string()
    .label('Phone Number')
    .min(11)
    .required('Please enter a valid Phone Number'),
});


YellowBox.ignoreWarnings(['Setting a timer']);
export default class AddInfoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorMessage: '',
      address: '',
      phoneNumber: '',
    }
  }

  render() {
    const {theme, setModalVisible, saveUserDetailsAddressAndPhoneNumber, visible, modalSuccessTextVisible} = this.props;
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
                <Text style={styles.appText}>You can add your Address and Phone Number below.</Text>

                <Formik initialValues={{address: '', phoneNumber: ''}}
                        onSubmit={values => saveUserDetailsAddressAndPhoneNumber(values)}
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
                      <TextInput
                        theme={theme}
                        placeholder="Address"
                        onChangeText={handleChange('address')}
                        onBlur={handleBlur('address')}
                        value={values.address}
                        mode='outlined'
                      />
                      <ErrorMessage errorValue={touched.address && errors.address}/>

                      <TextInput
                        theme={theme}
                        placeholder="Phone Number"
                        onChangeText={handleChange('phoneNumber')}
                        onBlur={handleBlur('phoneNumber')}
                        value={values.phoneNumber}
                        mode='outlined'
                      />
                      <ErrorMessage errorValue={touched.phoneNumber && errors.phoneNumber}/>

                      <Button theme={theme} onPress={handleSubmit}
                              mode="contained"
                              labelStyle={styles.buttonTextColour}>
                        Save
                      </Button>
                      {modalSuccessTextVisible ?
                        <Text style={styles.appText}>Successfully added your details. Press close to return to you profile.</Text>
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
