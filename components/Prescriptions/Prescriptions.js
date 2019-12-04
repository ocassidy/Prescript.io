import React, {Component} from 'react';
import {View, YellowBox, ScrollView, Image, Alert} from 'react-native'
import {Button, Text, List, Divider} from 'react-native-paper';
import styles from "../themes/styles";
import * as firebase from "firebase";
import {db} from "../../firebaseConfig";
import AddPrescriptionModal from "./AddPrescriptionModal";
import uuidv4 from 'uuid/v4'

YellowBox.ignoreWarnings(['Setting a timer']);
export default class Reminders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prescriptions: {},
      expanded: true,
      addPrescriptionModalVisible: false,
      modalSuccessTextVisible: false,
      deletePrescriptionModalVisible: false
    };
  }

  componentDidMount = () => {
    this.getPrescriptions();
  };

  handlePress = () =>
    this.setState({
      expanded: !this.state.expanded
    });

  setAddPrescriptionModalVisible = (visible) => {
    if (visible) {
      this.setState({addPrescriptionModalVisible: true, modalSuccessTextVisible: false});
    } else {
      this.setState({addPrescriptionModalVisible: false, modalSuccessTextVisible: false});
    }
  };

  handleAddPrescription = (values) => {
    let user = firebase.auth().currentUser;
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
      prescriptionId: prescriptionId
    };

    db.collection('users')
      .doc(user.uid)
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
        console.log('successful add of address/phoneNumber to user on id', user.uid)
      })
      .catch(error => console.log('unsuccessful add of address/phoneNumber to user', user.uid, error));
  };

  handleDeletePrescription = (prescriptionId) => {
    let user = firebase.auth().currentUser

    db.collection('users')
      .doc(user.uid)
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
        console.log('successful delete of prescription', prescriptionId, 'on user id', user.uid)
      })
      .catch(error => console.log('unsuccessful delete of prescription', prescriptionId, 'on user id', user.uid, 'with', error));
  };

  deletePrescription = (prescriptionId) => {
    //console.log(prescriptionId)
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
    let user = firebase.auth().currentUser;
    db.collection('users')
      .doc(user.uid)
      .get()
      .then(document => {
        this.setState({
          prescriptions: document.get('prescriptions')
        })
      })
      .catch(error => {
        console.log('failed to retrieve reminder items', error.message)
      });
  };

  render() {
    const {theme, navigation} = this.props;
    const {
      prescriptions,
      deleteItemSuccess,
      deleteItemSuccessText,
      addPrescriptionModalVisible,
      modalSuccessTextVisible,
      deletePrescriptionModalVisible
    } = this.state;
    let prescriptionsList;
    if (prescriptions && Object.keys(prescriptions).length) {
      prescriptionsList = Object.values(prescriptions).map((prescription, index) => {
        return (
          <List.Accordion
            title={prescription.medicine}
            key={index}
            theme={theme}
            style={styles.prescriptionListAccordion}
            left={props => <List.Icon {...props} icon="pill"/>}
          >
            {/*<Image*/}
            {/*  style={{width: 50, height: 50}}*/}
            {/*  source={{uri: 'https://facebook.github.io/react-native/img/tiny_logo.png'}}*/}
            {/*/>*/}
            <View style={styles.prescriptionListAccordionInner}>
              <List.Item theme={theme} style={styles.appText}
                         title={'Active: ' + prescription.active}/>
              <List.Item theme={theme} style={styles.appText}
                         title={'Dosage: ' + prescription.dosage}/>
              <List.Item theme={theme} style={styles.appText}
                         title={'Usage Duration: ' + prescription.usageDuration}/>
              <List.Item theme={theme} style={styles.appText}
                         title={'Type: ' + prescription.type}/>
              <Divider/>
              <List.Item theme={theme} style={styles.appText}
                         title={'Prescribing Doctor: ' + prescription.prescribingDoctor}/>
              <List.Item theme={theme} style={styles.appText}
                         title={'Provider: ' + prescription.providerName}/>

              <View style={styles.prescriptionListAccordionButtons}>
                <Button theme={theme} onPress={() => navigation.navigate('Camera')}
                        mode="contained"
                        style={styles.prescriptionListAccordionAddImageButton}
                        labelStyle={styles.buttonTextColour}>
                  Add Image
                </Button>

                <Button theme={theme}
                        onPress={() => this.editAgendaItem()}>
                  Edit Prescription
                </Button>

                <Button theme={theme}
                        onPress={() => this.deletePrescription(prescription.prescriptionId)}
                        mode='contained'
                        color={'red'}
                        labelStyle={styles.buttonTextColour}>
                  Delete Prescription
                </Button>
              </View>
            </View>
          </List.Accordion>
        )
      });
    }

    return (
      <View style={styles.container}>
        {prescriptions && Object.keys(prescriptions).length
          ? null
          : <Text style={styles.appText}>You currently have no prescriptions added.</Text>}

        {prescriptions && Object.keys(prescriptions).length
          ? <ScrollView>
            <List.Section theme={theme} style={styles.prescriptionListSection}>
              <List.Subheader style={styles.appText}>Your Prescriptions</List.Subheader>
              {prescriptionsList}
            </List.Section>
          </ScrollView>
          : null}

        {addPrescriptionModalVisible
          ? <AddPrescriptionModal
            handleAddPrescription={this.handleAddPrescription}
            modalSuccessTextVisible={modalSuccessTextVisible}
            setModalVisible={() => this.setAddPrescriptionModalVisible()}
            onRequestClose={() => this.setAddPrescriptionModalVisible()}>
          </AddPrescriptionModal>
          : null}

        <View style={styles.inner}>
          {deleteItemSuccess === true ? <Text style={styles.appText}>{deleteItemSuccessText}</Text> : null}
          <Button theme={theme}
                  onPress={() => this.setAddPrescriptionModalVisible(true)}>
            Add Prescription
          </Button>
        </View>
      </View>
    );
  }
}
