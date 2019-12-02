import React, {Component} from 'react';
import {View, YellowBox, ScrollView, Image} from 'react-native'
import {Button, Text, List, Divider} from 'react-native-paper';
import styles from "../themes/styles";
import * as firebase from "firebase";
import {db} from "../../firebaseConfig";

YellowBox.ignoreWarnings(['Setting a timer']);
export default class Reminders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prescriptions: [],
      expanded: true
    };
  }

  componentDidMount() {
    this.getPrescriptions();
  }

  handlePress = () =>
    this.setState({
      expanded: !this.state.expanded
    });


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
    const {theme} = this.props;
    const {prescriptions, deleteItemSuccess, deleteItemSuccessText} = this.state;
    const prescriptionsList = prescriptions.map((prescription, index) => {
      return (
        <List.Accordion
          title={prescription.medicineDetails.medicine}
          key={index}
          left={props => <List.Icon {...props} icon="pill"/>}
        >
          <Image
            style={{width: 50, height: 50}}
            source={{uri: 'https://facebook.github.io/react-native/img/tiny_logo.png'}}
          />
          <List.Item title={'Is active: ' + prescription.medicineDetails.active}/>
          <List.Item title={'Dosage: ' + prescription.medicineDetails.dosage}/>
          <List.Item title={'Usage Duration: ' + prescription.medicineDetails.usageDuration}/>
          <List.Item title={'Type: ' + prescription.medicineDetails.type}/>
          <Divider/>
          <List.Item title={'Prescribing Doctor: ' + prescription.providerDetails.prescribingDoctor}/>
          <List.Item title={'Provider: ' + prescription.providerDetails.providerName}/>
        </List.Accordion>
      )
    });

    return (
      <View style={styles.container}>
        {prescriptions.length > 0
          ? <Text style={styles.appText}>Your Prescriptions:</Text>
          : <Text style={styles.appText}>You currently have no prescriptions added.</Text>}

        <ScrollView>
          <List.Section title="Prescriptions">
            {prescriptionsList}
          </List.Section>
        </ScrollView>

        <View style={styles.inner}>
          {deleteItemSuccess === true ? <Text>{deleteItemSuccessText}</Text> : null}
          <Button theme={theme}
                  onPress={() => this.setAddEditReminderModalVisible(true)}>
            Add Prescription
          </Button>

          <Button theme={theme}
                  onPress={() => this.editAgendaItem()}>
            Edit Prescription
          </Button>
          <Button theme={theme}
                  onPress={() => this.setDeleteReminderModalVisible(true)}
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
