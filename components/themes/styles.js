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
  smallSpinner: {
    marginTop: 10,
    marginBottom: 10,
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
  loggedOutText: {
    fontSize: 18,
    padding: 10,
    textAlign: 'center',
    color: 'orange'
  },
  changedPasswordText: {
    fontSize: 18,
    padding: 10,
    textAlign: 'center',
    color: 'green'
  },
  deletedAccountText: {
    fontSize: 18,
    padding: 10,
    textAlign: 'center',
    color: 'red'
  },
  buttonSpacing: {
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
  agendaDayMonthText: {
    fontSize: 18,
    marginTop: 30,
    marginBottom: 5,
    marginRight: 10,
    marginLeft: 10,
    textAlign: 'center',
  },
  agendaItem: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 18
  },
  agendaItemButtonView: {
    flexDirection: 'row',
    marginRight: 'auto'
  },
  addReminderText: {
    textAlign: 'center',
    fontSize: 18
  },
  agendaButtonText: {
    fontSize: 18
  },
  agendaItemText: {
    marginLeft: 15,
    fontSize: 18
  },
  agendaEmptyDate: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 18
  }
});
