import React, {Component} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import Photo from './Photo';
import * as FileSystem from "expo-file-system";
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import {Button} from "react-native-paper";

const PHOTOS_DIR = FileSystem.documentDirectory + 'photos';

export default class Gallery extends Component {
  state = {
    faces: {},
    images: {},
    photos: [],
    selected: [],
  };

  componentDidMount = async () => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status !== 'granted') {
      throw new Error('Denied CAMERA_ROLL permissions!');
    }
    const photos = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
    this.setState({photos});
  };

  toggleSelection = (uri, isSelected) => {
    let selected = this.state.selected;
    if (isSelected) {
      selected.push(uri);
    } else {
      selected = selected.filter(item => item !== uri);
    }
    this.setState({selected});
  };

  saveToGallery = async () => {
    const photos = this.state.selected;

    if (photos.length > 0) {
      const promises = photos.map(photoUri => {
        return MediaLibrary.createAssetAsync(photoUri);
      });

      await Promise.all(promises);
      alert('Successfully saved photos to user\'s gallery!');
    } else {
      alert('No photos to save!');
    }
  };

  renderPhoto = (fileName) =>
    <Photo
      key={fileName}
      uri={`${PHOTOS_DIR}/${fileName}`}
      onSelectionToggle={this.toggleSelection}
    />;

  render() {
    const {theme} = this.props;
    return (
      <View style={styles.container}>
        <ScrollView contentComponentStyle={{flex: 1}}>
          <View style={styles.pictures}>
            {this.state.photos.map(this.renderPhoto)}
          </View>
        </ScrollView>

        <Button
          theme={theme}
          labelStyle={{color: 'black'}}
          onPress={() => this.saveToGallery}>
          Save selected to gallery
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'white',
  },
  pictures: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  button: {
    padding: 20,
  },
  whiteText: {
    color: 'white',
  }
});
