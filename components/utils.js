import * as Permissions from 'expo-permissions';
import * as Notifications from "expo";

export function sendRegistrationEmail (user) {
  user.sendEmailVerification()
    .then(response => {
      console.log('response ', response);
    }).catch((error) => {
    console.log('error ', error);
  });
}

// export async function registerUserForPushNotifications (user) {
//   const { status: existingStatus } = await Permissions.getAsync(
//     Permissions.NOTIFICATIONS
//   );
//   let finalStatus = existingStatus;
//
//   if (existingStatus !== 'granted') {
//     const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
//     finalStatus = status;
//   }
//
//   if (finalStatus !== 'granted') {
//     return;
//   }
//
//   let token = await Notifications.getExpoPushTokenAsync();
// }
