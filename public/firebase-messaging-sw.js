importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

// Keep this config aligned with src/firebaseConfig.js
firebase.initializeApp({
  apiKey: "AIzaSyB6B34DTjhIQBODwkLL46NWcWJa6eFMkD8",
  authDomain: "chatme-7f37a.firebaseapp.com",
  projectId: "chatme-7f37a",
  messagingSenderId: "329581277288",
  appId: "1:329581277288:web:a1e89b4723ffd0589d4bdd",
});

const messaging = firebase.messaging();

// Background notification handler
messaging.onBackgroundMessage(function (payload) {
  if (!payload.notification) {
    const notificationTitle = "New Message";
    const notificationOptions = {
      body: payload.data?.body || "You have a new message",
      icon: "/ChatMe.svg",
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
  }
});
