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
    const {theme, setModalVisible, deleteAccount, visible, modalSuccessTextVisible} = this.props;
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
                <Text style={styles.appText}>Please re-enter you password to delete you account.</Text>

                <Formik initialValues={{password: ''}}
                        onSubmit={password => deleteAccount(password)}
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
                        placeholder="Password"
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                        mode='outlined'
                        secureTextEntry={true}
                      />
                      <ErrorMessage errorValue={touched.password && errors.password}/>

                      <Button theme={theme}
                              onPress={handleSubmit}
                              mode="contained"
                              color={'red'}
                              style={styles.buttonSpacing}
                              labelStyle={styles.buttonTextColour}>
                        Delete Account
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
