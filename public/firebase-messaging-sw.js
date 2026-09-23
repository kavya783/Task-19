importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAIflLoAjxq-BU_iOFdZQw3orL-H7PqWLI",
  authDomain: "mamaearth-push-notification.firebaseapp.com",
  projectId: "mamaearth-push-notification",
  storageBucket: "mamaearth-push-notification.firebasestorage.app",
  messagingSenderId: "531086667384",
  appId: "1:531086667384:web:377af2215c69856518478d",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Background message:",
    payload
  );

  const notificationTitle =
    payload.notification?.title || "Mamaearth";

  const notificationOptions = {
    body:
      payload.notification?.body ||
      "Welcome to Mamaearth!",
    icon: "/logo192.png",
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});