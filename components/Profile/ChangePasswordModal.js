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
  oldPassword: Yup.string()
    .min(6, 'Password must have at least 6 characters')
    .max(50, 'Password must not be more than 50 characters')
    .required('Required'),
  newPassword: Yup.string()
    .min(6, 'Password must have at least 6 characters')
    .max(50, 'Password must not be more than 50 characters')
    .required('Required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], "Passwords must match")
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
    const {theme, setModalVisible, visible, modalSuccessTextVisible, updatePassword} = this.props;
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

                <Formik initialValues={{oldPassword: '', newPassword: '', confirmPassword: ''}}
                        onSubmit={values => updatePassword(values)}
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
                        placeholder="Old Password"
                        onChangeText={handleChange('oldPassword')}
                        onBlur={handleBlur('oldPassword')}
                        value={values.oldPassword}
                        mode='outlined'
                        secureTextEntry={true}
                      />
                      <ErrorMessage errorValue={touched.oldPassword && errors.oldPassword}/>

                      <TextInput
                        theme={theme}
                        placeholder="New Password"
                        onChangeText={handleChange('newPassword')}
                        onBlur={handleBlur('newPassword')}
                        value={values.newPassword}
                        mode='outlined'
                        secureTextEntry={true}
                      />
                      <ErrorMessage errorValue={touched.newPassword && errors.newPassword}/>

                      <TextInput
                        theme={theme}
                        placeholder="Confirm Password"
                        onChangeText={handleChange('confirmPassword')}
                        onBlur={handleBlur('confirmPassword')}
                        value={values.confirmPassword}
                        mode='outlined'
                        secureTextEntry={true}
                      />
                      <ErrorMessage errorValue={touched.confirmPassword && errors.confirmPassword}/>

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
