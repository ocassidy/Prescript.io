import React, {Component} from 'react';
import {
  Image,
  View,
} from 'react-native';
import {Button, Text} from 'react-native-paper'
import * as firebase from 'firebase';
import * as ImagePicker from "expo-image-picker";
import * as Permissions from 'expo-permissions';
import styles from "../themes/styles";
import IsLoadingSpinner from "../common/IsLoadingSpinner";
import {db} from "../../firebaseConfig";

console.disableYellowBox = true;
export default class Camera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      uploading: false,
      imageUploadedSuccess: false,
      imageDatabaseLinkSuccess: false
    }
  }

  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
  }

  takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      aspect: [4, 3],
    });
    this.handleImagePicked(pickerResult);
  };

  pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      aspect: [4, 3],
    });
    this.handleImagePicked(pickerResult);
  };

  handleImagePicked = async (pickerResult) => {
    let user = firebase.auth().currentUser;
    try {
      this.setState({uploading: true});

      if (!pickerResult.cancelled) {
        await this.uploadImageAsync(pickerResult.uri)
          .then(response => {
            console.log('Image Saved to address', response);
            this.setState({
              image: response,
              imageUploadedSuccess: true
            });
          })
          .catch(error => {
            console.log(error);
          });

        let prescription = {
          prescriptionImage: this.state.image,
        };

        db.collection('users')
          .doc(user.uid)
          .set({
            prescriptions: {
              [this.props.navigation.getParam('prescriptionId')]: prescription
            }
          }, {merge: true})
          .then(response => {
            this.setState({
              imageDatabaseLinkSuccess: true
            });
            console.log('successful edit of color to user on id', user.uid)
          })
          .catch(error => console.log('unsuccessful edit of color to user', user.uid, error));
      }
    } catch (e) {
      console.log(e);
      alert('Upload failed.');
    } finally {
      this.setState({uploading: false});
    }
  };

  uploadImageAsync = async (uri) => {
    let user = firebase.auth().currentUser;
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.onerror = (e) => {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const ref = firebase
      .storage()
      .ref('users')
      .child(user.uid)
      .child('images')
      .child(this.props.navigation.getParam('prescriptionId'))
      .child('prescriptionImage');
    const snapshot = await ref.put(blob);
    blob.close();
    return await snapshot.ref.getDownloadURL();
  };

  render() {
    let {image, imageUploadedSuccess, uploading} = this.state;
    const {theme, navigation} = this.props;
    return (
      <View style={styles.container}>
        {uploading
          ? <IsLoadingSpinner/>
          : <View style={styles.inner}>
            {image
              ?
              <Image source={{uri: image}} style={{marginRight: 'auto', marginLeft: 'auto', width: 300, height: 400}}/>
              : <Text style={styles.appText}
                      theme={theme}>
                Image will appear here after upload.
              </Text>}

            {imageUploadedSuccess
              ? <Text style={styles.appText}
                      theme={theme}>
                Imaged Upload Success
              </Text>
              : null}

            <Button style={styles.buttonSpacing}
                    theme={theme}
                    onPress={this.pickImage}
                    mode='contained'
                    labelStyle={styles.buttonTextColour}>
              Pick an image from camera roll
            </Button>

            <Button style={styles.buttonSpacing}
                    theme={theme}
                    onPress={this.takePhoto}
                    mode='contained'
                    labelStyle={styles.buttonTextColour}>
              Take a Photo
            </Button>

            <Button style={styles.buttonSpacing}
                    theme={theme}
                    onPress={() => navigation.navigate('Prescriptions', {returnFromCamera: true})}
                    mode='outlined'>
              Return to Prescription
            </Button>
          </View>}
      </View>
    );
  }
}
