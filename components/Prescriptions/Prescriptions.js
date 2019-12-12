import React, {Component} from 'react';
import {Alert, ScrollView, View, Image} from 'react-native'
import {Button, Divider, List, Text} from 'react-native-paper';
import styles from "../themes/styles";
import * as firebase from "firebase";
import {db} from "../../firebaseConfig";
import AddPrescriptionModal from "./AddPrescriptionModal";
import {ColorPicker} from 'react-native-color-picker'
import uuidv4 from 'uuid/v4'

console.disableYellowBox = true;
export default class Reminders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prescriptions: {},
      addPrescriptionModalVisible: false,
      modalSuccessTextVisible: false,
      isEditMode: false,
      editItemSuccess: false,
      editItemSuccessText: '',
      colorPickerVisible: false,
      selectedColor: null,
      selectedIdToEdit: null,
      colourChangeSuccess: false,
      returnFromCamera: false,
      user: null,
      isLoading: true
    };
  }

  componentDidMount = async () => {
    await this.setState({
      user: firebase.auth().currentUser
    });

    if(this.state.user !== null && this.state.user !== undefined) {
      this.getPrescriptions();
    }
    else{
      this.setState({
        isLoading: true
      })
    }
  };

  setAddPrescriptionModalVisible = (visible) => {
    if (visible) {
      this.setState({addPrescriptionModalVisible: true, modalSuccessTextVisible: false});
    } else {
      this.setState({addPrescriptionModalVisible: false, modalSuccessTextVisible: false});
    }
  };

  handleAddPrescription = (values) => {
    const {uid} = this.state.user;
    const {medicine, dosage, type, usageDuration, prescribingDoctor, providerName} = values;
    let prescriptionId = uuidv4();

    let prescription = {
      medicine: medicine.trim(),
      dosage: dosage.trim(),
      type: type.trim(),
      usageDuration: usageDuration.trim(),
      prescribingDoctor: prescribingDoctor.trim(),
      providerName: providerName.trim(),
      active: true,
      borderColour: 'black',
      prescriptionId: prescriptionId
    };

    db.collection('users')
      .doc(uid)
      .set({
        prescriptions: {
          [prescriptionId]: prescription
        }
      }, {merge: true})
      .then(response => {
        this.setState({
          modalSuccessTextVisible: true
        });
        this.getPrescriptions();
        console.log('successful add of address/phoneNumber to user on id', uid)
      })
      .catch(error => console.log('unsuccessful add of address/phoneNumber to user', uid, error));
  };

  handleDeletePrescription = (prescriptionId) => {
    const {uid} = this.state.user;

    db.collection('users')
      .doc(uid)
      .set({
        'prescriptions': {
          [prescriptionId]: firebase.firestore.FieldValue.delete()
        }
      }, {merge: true})
      .then(response => {
        this.setState({
          deleteItemSuccess: true,
          deleteItemSuccessText: 'Successfully deleted item'
        });
        this.getPrescriptions();
        console.log('successful delete of prescription', prescriptionId, 'on user id', uid)
      })
      .catch(error => console.log('unsuccessful delete of prescription', prescriptionId, 'on user id', uid, 'with', error));
  };

  deletePrescription = (prescriptionId) => {
    Alert.alert(
      'Confirm',
      'Are you sure you wish to delete this prescription?',
      [
        {text: 'Yes', onPress: () => this.handleDeletePrescription(prescriptionId)},
        {text: 'No'}
      ],
      {cancelable: false}
    )
  };

  getPrescriptions = () => {
    const {uid} = this.state.user;
    db.collection('users')
      .doc(uid)
      .get()
      .then(document => {
        this.setState({
          prescriptions: document.get('prescriptions'),
          isLoading: false
        })
      })
      .catch(error => {
        console.log('failed to retrieve reminder items', error.message)
      });
  };

  handleEditPrescription = (prescriptionId) => {
    if (this.state.selectedColor === null) {
      return Alert.alert(
        'You have not selected a color!',
        'Tap the circle in the middle to set the colour',
        [
          {text: 'Ok'}
        ],
        {cancelable: false}
      )
    }
    const {uid} = this.state.user
    let prescription = {
      borderColour: this.state.selectedColor,
    };

    db.collection('users')
      .doc(uid)
      .set({
        prescriptions: {
          [prescriptionId]: prescription
        }
      }, {merge: true})
      .then(response => {
        this.setState({
          colourChangeSuccess: true
        });
        this.getPrescriptions();
        console.log('successful edit of color to user on id', uid)
      })
      .catch(error => console.log('unsuccessful edit of color to user', uid, error));
  };

  renderPicker = () => {
    const {theme} = this.props;
    return (
      <View style={styles.container}>
        <Text theme={theme}
              style={styles.appText}>
          Select the colour you prefer and then tap the circle in the middle to set the colour and press save.
        </Text>
        <ColorPicker
          onColorSelected={(color) => this.setState({
            selectedColor: color
          })}
          style={{flex: 1, backgroundColor: 'white'}}
        />

        {this.state.colourChangeSuccess
          ? <Text theme={theme} style={styles.appText}>
            Colour Saved!
          </Text>
          : null}

        <Button theme={theme} onPress={() => this.handleEditPrescription(this.state.selectedIdToEdit)}
                style={styles.buttonSpacing}
                mode="outlined">
          Save
        </Button>

        <Button theme={theme} onPress={() => this.setColorPickerVisible(false)}
                style={styles.buttonSpacing}
                mode="outlined">
          Close
        </Button>
      </View>
    )
  };

  setColorPickerVisible = (visible, prescriptionId) => {
    if (visible) {
      this.setState({
        colorPickerVisible: true,
        selectedIdToEdit: prescriptionId
      });
    } else {
      this.setState({
        colorPickerVisible: false,
        selectedColor: null,
        selectedIdToEdit: null,
        colourChangeSuccess: false
      });
    }
  };

  render() {
    const {theme, navigation} = this.props;
    const {
      prescriptions,
      deleteItemSuccess,
      deleteItemSuccessText,
      addPrescriptionModalVisible,
      modalSuccessTextVisible,
      isEditMode,
      prescriptionForEdit,
      colorPickerVisible,
      isLoading
    } = this.state;
    let prescriptionsList;
    if (this.props.navigation.getParam('returnFromCamera')) {
      this.getPrescriptions()
    }
    if (prescriptions && Object.keys(prescriptions).length) {
      prescriptionsList = Object.values(prescriptions).map((prescription, index) => {
        return (
          <List.Accordion id='prescriptionListItem'
                          title={prescription.medicine}
                          key={index}
                          theme={theme}
                          style={[styles.prescriptionListAccordion, {borderColor: prescription.borderColour}]}
                          left={props => <List.Icon {...props} icon="pill"/>}
          >
            <View style={[styles.prescriptionListAccordionInner, {borderColor: prescription.borderColour}]}>
              {prescription.prescriptionImage
                ? <Image style={{justifyContent: 'center', width: 250, height: 250, marginTop: 10}}
                         source={{uri: prescription.prescriptionImage}}
                />
                : null}
              <List.Item theme={theme} style={styles.appText}
                         title={'Active: ' + prescription.active}/>
              <List.Item theme={theme} style={styles.appText}
                         title={'Dosage: ' + prescription.dosage}/>
              <List.Item theme={theme} style={styles.appText}
                         title={'Usage Duration: ' + prescription.usageDuration}/>
              <List.Item theme={theme} style={styles.appText}
                         title={'Type: ' + prescription.type}/>
              <Divider style={{marginRight: 25}}/>
              <List.Item theme={theme} style={styles.appText}
                         title={'Prescribing Doctor: ' + prescription.prescribingDoctor}/>
              <List.Item theme={theme} style={styles.appText}
                         title={'Provider: ' + prescription.providerName}/>

              <Button theme={theme}
                      onPress={() => navigation.navigate('Camera', {prescriptionId: prescription.prescriptionId})}
                      style={styles.prescriptionListAccordionButtons}
                      mode="contained"
                      labelStyle={styles.buttonTextColour}>
                {prescription.prescriptionImage ? 'Change Image' : 'Add Image'}
              </Button>

              <Button theme={theme} onPress={() => this.setColorPickerVisible(true, prescription.prescriptionId)}
                      style={styles.prescriptionListAccordionButtons}
                      mode="outlined">
                Change Border Colour
              </Button>

              <Button theme={theme}
                      style={styles.prescriptionListAccordionButtons}
                      onPress={() => this.deletePrescription(prescription.prescriptionId)}
                      mode='contained'
                      color={'red'}
                      labelStyle={styles.buttonTextColour}>
                Delete Prescription
              </Button>
            </View>
          </List.Accordion>
        )
      });
    }

    return (
      <View style={styles.container}>
        {!colorPickerVisible
          ? <View style={styles.container}>
            {prescriptions && Object.keys(prescriptions).length
              ? null
              : <Text id='prescriptionNoDataText'
                      style={styles.appText}>You currently have no prescriptions added.
              </Text>}

            {prescriptions && Object.keys(prescriptions).length && !isLoading
              ? <ScrollView id='prescriptionScrollView'>
                <List.Section theme={theme} style={styles.prescriptionListSection} id='prescriptionListSection'>
                  <List.Subheader style={styles.appText}>Your Prescriptions</List.Subheader>
                  {prescriptionsList}
                </List.Section>
              </ScrollView>
              : null}

            {addPrescriptionModalVisible
              ? <AddPrescriptionModal
                isEditMode={isEditMode}
                prescriptionForEdit={prescriptionForEdit}
                handleAddPrescription={this.handleAddPrescription}
                modalSuccessTextVisible={modalSuccessTextVisible}
                setModalVisible={() => this.setAddPrescriptionModalVisible()}
                onRequestClose={() => this.setAddPrescriptionModalVisible()}>
              </AddPrescriptionModal>
              : null}

            <View style={styles.inner}>
              {deleteItemSuccess === true ? <Text style={styles.appText}>{deleteItemSuccessText}</Text> : null}
              <Button id='addPrescriptionButton'
                      theme={theme}
                      onPress={() => this.setAddPrescriptionModalVisible(true)}>
                Add Prescription
              </Button>
            </View>
          </View>
          : this.renderPicker()}
      </View>
    );
  }
}

