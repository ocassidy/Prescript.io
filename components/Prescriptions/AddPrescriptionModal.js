import React, {Component} from 'react';
import {KeyboardAvoidingView, Platform, View, Modal, Keyboard, TouchableWithoutFeedback} from 'react-native'
import {Text, TextInput, Button} from 'react-native-paper';
import {Formik} from "formik";
import * as Yup from 'yup';
import {ErrorMessage} from "../common/ErrorMessage";
import styles from '../themes/styles';

const ModalSchema = Yup.object().shape({
  dosage: Yup.string()
    .label('dosage')
    .min(4)
    .required('Required'),
  medicine: Yup.string()
    .label('medicine')
    .min(4)
    .required('Required'),
  type: Yup.string()
    .label('type')
    .min(4)
    .required('Required'),
  usageDuration: Yup.string()
    .label('usageDuration')
    .min(4)
    .required('Required'),
  prescribingDoctor: Yup.string()
    .label('prescribingDoctor')
    .min(4)
    .required('Required'),
  providerName: Yup.string()
    .label('providerName')
    .min(4)
    .required('Required')
});

console.disableYellowBox = true;
export default class AddPrescriptionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorMessage: '',
    }
  }

  render() {
    const {theme, setModalVisible, visible, modalSuccessTextVisible, handleAddPrescription} = this.props;
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null} enabled>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                  <Text style={styles.appText}>You can add a Prescription below.</Text>

                  <Formik initialValues={{
                    dosage: '',
                    medicine: '',
                    type: '',
                    usageDuration: '',
                    prescribingDoctor: '',
                    providerName: ''
                  }}
                          onSubmit={values => handleAddPrescription(values)}
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
                          id='addPrescriptionMedicineTextInput'
                          theme={theme}
                          placeholder="Medicine"
                          onChangeText={handleChange('medicine')}
                          onBlur={handleBlur('medicine')}
                          value={values.medicine}
                          mode='outlined'
                        />
                        <ErrorMessage errorValue={touched.medicine && errors.medicine}/>

                        <TextInput
                          id='addPrescriptionDosageTextInput'
                          theme={theme}
                          placeholder="Dosage e.g. 250ml...."
                          onChangeText={handleChange('dosage')}
                          onBlur={handleBlur('dosage')}
                          value={values.dosage}
                          mode='outlined'
                        />
                        <ErrorMessage errorValue={touched.dosage && errors.dosage}/>

                        <TextInput
                          id='addPrescriptionTypeTextInput'
                          theme={theme}
                          placeholder="Type e.g. tablets..."
                          onChangeText={handleChange('type')}
                          onBlur={handleBlur('type')}
                          value={values.type}
                          mode='outlined'
                        />
                        <ErrorMessage errorValue={touched.type && errors.type}/>

                        <TextInput
                          id='addPrescriptionUsageDurationTextInput'
                          theme={theme}
                          placeholder="Usage Duration e.g. 2 Weeks..."
                          onChangeText={handleChange('usageDuration')}
                          onBlur={handleBlur('usageDuration')}
                          value={values.usageDuration}
                          mode='outlined'
                          numberOfLines={4}
                        />
                        <ErrorMessage errorValue={touched.usageDuration && errors.usageDuration}/>

                        <TextInput
                          id='addPrescriptionDoctorTextInput'
                          theme={theme}
                          placeholder="Prescribing Doctor"
                          onChangeText={handleChange('prescribingDoctor')}
                          onBlur={handleBlur('prescribingDoctor')}
                          value={values.prescribingDoctor}
                          mode='outlined'
                          numberOfLines={4}
                        />
                        <ErrorMessage errorValue={touched.prescribingDoctor && errors.prescribingDoctor}/>

                        <TextInput
                          id='addPrescriptionProviderTextInput'
                          theme={theme}
                          placeholder="Provider Name"
                          onChangeText={handleChange('providerName')}
                          onBlur={handleBlur('providerName')}
                          value={values.providerName}
                          mode='outlined'
                          numberOfLines={4}
                        />
                        <ErrorMessage errorValue={touched.providerName && errors.providerName}/>

                        <Button id='addPrescriptionModalSubmit'
                                theme={theme}
                                onPress={handleSubmit}
                                mode="contained"
                                style={styles.buttonSpacing}
                                labelStyle={styles.buttonTextColour}>
                          Save
                        </Button>
                        {modalSuccessTextVisible
                          ? <Text style={styles.appText}>Successfully added this reminder. Press close to return to your
                            reminders.
                          </Text>
                          : undefined}
                      </View>
                    )}
                  </Formik>

                  <Button id='addPrescriptionCloseButton'
                          onPress={() => {
                            setModalVisible(false)
                          }}>
                    Close
                  </Button>
                </View>
              </View>
            </Modal>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    )
  }
}
