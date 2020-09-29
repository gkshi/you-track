/* eslint-disable no-undef */

importScripts('https://www.gstatic.com/firebasejs/7.16.1/firebase-app.js')
importScripts(
  'https://www.gstatic.com/firebasejs/7.16.1/firebase-messaging.js'
)
// For an optimal experience using Cloud Messaging, also add the Firebase SDK for Analytics.
importScripts(
  'https://www.gstatic.com/firebasejs/7.16.1/firebase-analytics.js'
)

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: 'AIzaSyBUNP7efjDmRe02XpM0GIheZaGYsBfdU7Y',
  projectId: 'youtrack-a4424',
  messagingSenderId: '671268226802',
  appId: '1:671268226802:web:3ec02f121f8282b466b26b'
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()

console.log('messaging', messaging, messaging.getToken())

// messaging.setBackgroundMessageHandler(function (payload) {
//   console.log(
//     '[firebase-messaging-sw.js] Received background message ',
//     payload
//   )
//   // Customize notification here
//   const notificationTitle = 'Background Message Title'
//   const notificationOptions = {
//     body: 'Background Message body.',
//     icon: '/itwonders-web-logo.png'
//   }
//
//   return self.registration.showNotification(
//     notificationTitle,
//     notificationOptions
//   )
// })
