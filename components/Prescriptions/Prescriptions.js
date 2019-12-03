import React, {Component} from 'react';
import {View, YellowBox, ScrollView, Image} from 'react-native'
import {Button, Text, List, Divider} from 'react-native-paper';
import styles from "../themes/styles";
import * as firebase from "firebase";
import {db} from "../../firebaseConfig";
import AddPrescriptionModal from "./AddPrescriptionModal";

YellowBox.ignoreWarnings(['Setting a timer']);
export default class Reminders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prescriptions: [],
      expanded: true,
      addPrescriptionModalVisible: false,
      modalSuccessTextVisible: false
    };
  }

  componentDidMount = () => {
    this.getPrescriptions();
  }

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

  handleAddPrescription = () => {

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
    const {prescriptions, deleteItemSuccess, deleteItemSuccessText, addPrescriptionModalVisible, modalSuccessTextVisible} = this.state;
    const prescriptionsList = prescriptions.map((prescription, index) => {
      return (
        <List.Accordion
          title={prescription.medicineDetails.medicine}
          key={index}
          theme={theme}
          style={styles.prescriptionListAccordion}
          left={props => <List.Icon {...props} icon="pill"/>}
        >
          {/*<Image*/}
          {/*  style={{width: 50, height: 50}}*/}
          {/*  source={{uri: 'https://facebook.github.io/react-native/img/tiny_logo.png'}}*/}
          {/*/>*/}
          <List.Item theme={theme} style={styles.appText}
                     title={'Active: ' + prescription.medicineDetails.active}/>
          <List.Item theme={theme} style={styles.appText}
                     title={'Dosage: ' + prescription.medicineDetails.dosage}/>
          <List.Item theme={theme} style={styles.appText}
                     title={'Usage Duration: ' + prescription.medicineDetails.usageDuration}/>
          <List.Item theme={theme} style={styles.appText}
                     title={'Type: ' + prescription.medicineDetails.type}/>
          <Divider/>
          <List.Item theme={theme} style={styles.appText}
                     title={'Prescribing Doctor: ' + prescription.providerDetails.prescribingDoctor}/>
          <List.Item theme={theme} style={styles.appText}
                     title={'Provider: ' + prescription.providerDetails.providerName}/>

          <Button theme={theme} onPress={() => navigation.navigate('Camera')}
                  mode="contained"
                  style={styles.prescriptionListAccordionButton}
                  labelStyle={styles.buttonTextColour}>
            Add Image
          </Button>
        </List.Accordion>
      )
    });

    return (
      <View style={styles.container}>
        {!prescriptions.length > 0
          ? <Text style={styles.appText}>You currently have no prescriptions added.</Text>
          : null}

        {prescriptions.length > 0
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
          {deleteItemSuccess === true ? <Text>{deleteItemSuccessText}</Text> : null}
          <Button theme={theme}
                  onPress={() => this.setAddPrescriptionModalVisible(true)}>
            Add Prescription
          </Button>

          <Button theme={theme}
                  onPress={() => this.editAgendaItem()}>
            Edit Prescription
          </Button>
          <Button theme={theme}
                  onPress={() => this.setAddPrescriptionModalVisible(true)}
                  mode='contained'
                  color={'red'}
                  labelStyle={styles.buttonTextColour}>
            Delete Prescription
          </Button>
        </View>
      </View>
    );
  }
}
