import React, {Component} from 'react';
import {Text, View, TouchableOpacity, BackHandler, StyleSheet} from 'react-native';
import * as Permissions from 'expo-permissions';
import {Camera} from 'expo-camera';
import {
  Foundation,
  Ionicons,
  MaterialIcons,
  Octicons
} from '@expo/vector-icons';
import * as firebase from "firebase";
import * as FileSystem from "expo-file-system";
import Gallery from "./Gallery";

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const flashIcons = {
  off: 'flash-off',
  on: 'flash-on',
  auto: 'flash-auto',
  torch: 'highlight'
};

export default class takePictureCamera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      flash: 'off',
      zoom: 0,
      autoFocus: 'on',
      whiteBalance: 'auto',
      ratio: '16:9',
      ratios: [],
      newPhotos: false,
      pictureSize: undefined,
      pictureSizes: [],
      pictureSizeId: 0,
      showGallery: false,
    };
  }

  componentDidMount = async () => {
    BackHandler.addEventListener('hardwareBackPress', () => false);
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
    FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'photos').catch(e => {
      console.log(e, 'Directory exists');
    });
  };

  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', () => true);
  };

  getRatios = async () => {
    const ratios = await this.camera.getSupportedRatios();
    return ratios;
  };

  toggleMoreOptions = () => {
    this.setState({showMoreOptions: !this.state.showMoreOptions})
  };

  toggleFacing = () => {
    this.setState({type: this.state.type === 'back' ? 'front' : 'back'})
  };

  toggleFlash = () => {
    this.setState({flash: flashModeOrder[this.state.flash]})
  };

  setRatio = ratio => {
    this.setState({ratio})
  };

  toggleFocus = () => {
    this.setState({autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on'})
  };

  zoomOut = () => {
    this.setState({zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1})
  };

  zoomIn = () => {
    this.setState({zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1})
  };

  setFocusDepth = depth => {
    this.setState({depth})
  };

  takePicture = () => {
    if (this.camera) {
      this.camera.takePictureAsync({onPictureSaved: this.onPictureSaved});
    }
  };

  onPictureSaved = async photo => {
    await FileSystem.moveAsync({
      from: photo.uri,
      to: `${FileSystem.documentDirectory}photos/${Date.now()}.png`,
    });
    this.setState({newPhotos: true});
  };

  handleMountError = ({message}) => console.error(message);

  renderNoPermissions = () => {
    return (
      <View style={styles.noPermissions}>
        <Text style={{color: 'white'}}>
          Camera permissions not granted - cannot open camera preview.
        </Text>
      </View>
    )
  };

  renderTopBar = () => {
    const {navigation} = this.props;
    return (
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.toggleButton} onPress={() => navigation.navigate('Prescriptions')}>
          <MaterialIcons name='arrow-back' size={32} color="white"/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFlash}>
          <MaterialIcons name={flashIcons[this.state.flash]} size={32} color="white"/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFocus}>
          <Text style={[styles.autoFocusLabel, {color: this.state.autoFocus === 'on' ? "white" : "#6b6b6b"}]}>AF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFacing}>
          <Ionicons name="ios-reverse-camera" size={32} color="white"/>
        </TouchableOpacity>
      </View>
    )
  };

  renderBottomBar = () => {
    return (
      <View
        style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomButton} onPress={this.toggleMoreOptions}>
          <Octicons name="kebab-horizontal" size={30} color="white"/>
        </TouchableOpacity>
        <View style={{flex: 0.4}}>
          <TouchableOpacity
            onPress={this.takePicture}
            style={{alignSelf: 'center'}}
          >
            <Ionicons name="ios-radio-button-on" size={70} color="white"/>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.bottomButton} onPress={() => this.props.navigation.navigate('Gallery')}>
          <View>
            <Foundation name="thumbnails" size={30} color="white"/>
            {this.state.newPhotos && <View style={styles.newPhotosDot}/>}
          </View>
        </TouchableOpacity>
      </View>
    )
  };

  renderCamera = () => {
    return (
      <View style={{flex: 1}}>
        <Camera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.camera}
          onCameraReady={this.collectPictureSizes}
          type={this.state.type}
          flashMode={this.state.flash}
          autoFocus={this.state.autoFocus}
          zoom={this.state.zoom}
          whiteBalance={this.state.whiteBalance}
          ratio={this.state.ratio}
          pictureSize={this.state.pictureSize}
          onMountError={this.handleMountError}
        >
          {this.renderTopBar()}
          {this.renderBottomBar()}
        </Camera>
      </View>
    );
  };

  render() {
    const cameraScreenContent = this.state.hasCameraPermission
      ? this.renderCamera()
      : this.renderNoPermissions();
    return <View style={styles.container}>{cameraScreenContent}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flex: 0.2,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bottomBar: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    flex: 0.12,
    flexDirection: 'row',
  },
  noPermissions: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  gallery: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  toggleButton: {
    flex: 0.25,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoFocusLabel: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  bottomButton: {
    flex: 0.3,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newPhotosDot: {
    position: 'absolute',
    top: 0,
    right: -5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4630EB'
  },
  options: {
    position: 'absolute',
    bottom: 80,
    left: 30,
    width: 200,
    height: 160,
    backgroundColor: '#000000BA',
    borderRadius: 4,
    padding: 10,
  },
  detectors: {
    flex: 0.5,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  pictureQualityLabel: {
    fontSize: 10,
    marginVertical: 3,
    color: 'white'
  },
  pictureSizeContainer: {
    flex: 0.5,
    alignItems: 'center',
    paddingTop: 10,
  },
  pictureSizeChooser: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  pictureSizeLabel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#FFD700',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  row: {
    flexDirection: 'row',
  },
});
