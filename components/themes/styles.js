import {
  StyleSheet
} from 'react-native';

export default styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inner: {
    padding: 20,
    textAlign: 'center',
    textAlignVertical: "center",
  },
  spinner: {
    marginTop: 350,
    marginBottom: 15,
    padding: 20,
    textAlign: 'center',
    justifyContent: 'center',
    textAlignVertical: "center",
    alignItems: 'center'
  },
  appTitle: {
    marginTop: 15,
    fontSize: 30,
    padding: 10,
    textAlign: 'center',
  },
  pageTitle: {
    fontSize: 26,
    padding: 10,
    textAlign: 'center',
  },
  appText: {
    fontSize: 20,
    padding: 10,
    textAlign: 'center'
  },
  buttonSpacing: {
    marginTop: 10,
    marginTop: 10,
  },
  buttonTextColour: {
    color: 'white'
  },
  errorText: {
    flexWrap: "wrap",
    color: 'red',
    textAlign: 'left',
    marginTop: 5,
    marginBottom: 5
  },
});