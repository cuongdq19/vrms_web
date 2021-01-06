importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-messaging.js');

const config = {
  apiKey: 'API-KEY',
  authDomain: 'AUTH-DOMAIN',
  databaseURL: 'DATABASE-URL',
  projectId: 'PROJECT-ID',
  storageBucket: 'STORAGE-BUCKET',
  messagingSenderId: 'MESSAGING-SENDER-ID',
  appId: 'APP-ID',
};

firebase.initializeApp(config);
const messaging = firebase.messaging();
