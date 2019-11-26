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
  password: Yup.string()
    .min(6, 'Password must have at least 6 characters')
    .max(50, 'Password must not be more than 50 characters')
    .required('Required'),
});


YellowBox.ignoreWarnings(['Setting a timer']);
export default class AddInfoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorMessage: '',
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
                <Text style={styles.appText}>You can change you password below.</Text>

                <Formik initialValues={{newPassword: ''}}
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
                        placeholder="New Password"
                        onChangeText={handleChange('newPassword')}
                        onBlur={handleBlur('newPassword')}
                        value={values.newPassword}
                        mode='outlined'
                      />
                      <ErrorMessage errorValue={touched.newPassword && errors.newPassword}/>

                      <Button theme={theme} onPress={handleSubmit}
                              mode="contained"
                              labelStyle={styles.buttonTextColour}>
                        Change Password
                      </Button>
                      {modalSuccessTextVisible ?
                        <Text style={styles.appText}>Successfully changed your password.</Text>
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
