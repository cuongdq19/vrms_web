import firebase from 'firebase/app';
import 'firebase/messaging';

const config = {
  apiKey: 'AIzaSyCwESM5a4Ar-fDo-PWbbec1UmBgGN-PoPU',
  authDomain: 'vrms-290212.firebaseapp.com',
  databaseURL: 'https://vrms-290212.firebaseio.com',
  projectId: 'vrms-290212',
  storageBucket: 'vrms-290212.appspot.com',
  messagingSenderId: '887672311279',
  appId: '1:887672311279:web:0eecd54b454c47e6b93a1a',
  measurementId: 'G-J2W5VXZ37L',
};

firebase.initializeApp(config);

export const messaging = firebase.messaging();

export const requestFirebaseNotificationPermission = () =>
  new Promise((resolve, reject) => {
    messaging
      .requestPermission()
      .then(() => messaging.getToken())
      .then((firebaseToken) => {
        console.log(firebaseToken);
        resolve(firebaseToken);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });
