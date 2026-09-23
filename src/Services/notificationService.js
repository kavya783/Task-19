
import {
  getToken,
  onMessage,
} from "firebase/messaging";

import { messaging } from "../firebase";

const API_URL = (
  process.env.REACT_APP_API_URL || ""
).replace(/\/+$/, "");

const VAPID_KEY =
  process.env.REACT_APP_FIREBASE_VAPID_KEY;


// REQUEST NOTIFICATION PERMISSION + GENERATE FCM TOKEN


export const requestNotificationPermission = async () => {
  console.log(" Notification function started");

  try {
  
    // CHECK BROWSER SUPPORT
  

    if (!("Notification" in window)) {
      console.error(
        " Browser notifications are not supported"
      );
      return null;
    }

    if (!("serviceWorker" in navigator)) {
      console.error(
        " Service Worker is not supported"
      );
      return null;
    }

  
    // CHECK VAPID KEY
  

    if (!VAPID_KEY) {
      console.error(
        " Firebase VAPID key is missing"
      );
      return null;
    }

  
    // CHECK FIREBASE MESSAGING
  

    if (!messaging) {
      console.error(
        " Firebase messaging is unavailable"
      );
      return null;
    }

  
    // NOTIFICATION PERMISSION
  

    let permission =
      Notification.permission;

    console.log(
      " Current notification permission:",
      permission
    );

    if (permission !== "granted") {
      permission =
        await Notification.requestPermission();
    }

    console.log(
      " Notification permission:",
      permission
    );

    if (permission !== "granted") {
      console.error(
        " Notification permission denied"
      );
      return null;
    }

  
    // SERVICE WORKER
  

    console.log(
      " Checking Firebase service worker..."
    );

    const serviceWorkerUrl =
      "/firebase-messaging-sw.js";

  
    // CHECK WHETHER FILE EXISTS
  

    console.log(
      " Checking:",
      serviceWorkerUrl
    );

    const swResponse =
      await fetch(serviceWorkerUrl, {
        cache: "no-store",
      });

    console.log(
      "Service worker HTTP status:",
      swResponse.status
    );

    if (!swResponse.ok) {
      throw new Error(
        `Firebase service worker file not found. HTTP ${swResponse.status}`
      );
    }

  
    // GET EXISTING REGISTRATION
  

    let registration =
      await navigator.serviceWorker.getRegistration(
        "/"
      );

    if (registration) {
      console.log(
        " Existing service worker found:",
        registration.scope
      );

      
      if (
        registration.active ||
        registration.installing ||
        registration.waiting
      ) {
        console.log(
          "Existing service worker registration can be used"
        );
      }
    }

  
    // REGISTER IF NOT AVAILABLE
  

    if (!registration) {
      console.log(
        " Registering Firebase service worker..."
      );

      registration =
        await navigator.serviceWorker.register(
          serviceWorkerUrl,
          {
            scope: "/",
            updateViaCache: "none",
          }
        );

      console.log(
        " Firebase service worker registration created"
      );

      console.log(
        " Service worker scope:",
        registration.scope
      );
    }

  
    // WAIT FOR SERVICE WORKER
  

    console.log(
      " Checking service worker activation..."
    );

    if (!registration.active) {
      await new Promise(
        (resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(
              new Error(
                "Firebase service worker activation timed out after 10 seconds"
              )
            );
          }, 10000);

          const checkWorker = () => {
            if (registration.active) {
              clearTimeout(timeout);

              console.log(
                " Firebase service worker is active"
              );

              resolve();
              return;
            }

            setTimeout(
              checkWorker,
              200
            );
          };

          checkWorker();
        }
      );
    } else {
      console.log(
        " Firebase service worker is already active"
      );
    }

  
    // GENERATE FCM TOKEN
  

    console.log(
      " Generating FCM token..."
    );

    const token = await getToken(
      messaging,
      {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration:
          registration,
      }
    );

    if (!token) {
      console.error(
        " FCM token was not generated"
      );

      return null;
    }

    console.log(
      " FCM token generated successfully"
    );

    console.log(
      "FCM TOKEN:",
      token
    );

    return token;

  } catch (error) {
    console.error(
      " Notification setup error:",
      error
    );

    return null;
  }
};


// SAVE DEVICE TOKEN


export const saveDeviceToken = async (
  token,
  userId
) => {
  try {
    if (!token) {
      console.error(
        " FCM token missing"
      );
      return false;
    }

    if (!userId) {
      console.error(
        " User ID missing"
      );
      return false;
    }

    if (!API_URL) {
      console.error(
        " REACT_APP_API_URL is missing"
      );
      return false;
    }

    console.log(
      "📤 Saving FCM token for user:",
      userId
    );

    const response = await fetch(
      `${API_URL}/device_tokens`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          token: token,
          user_id: userId,
        }),
      }
    );

    const responseText =
      await response.text();

    console.log(
      "📥 Device token response:",
      response.status,
      responseText
    );

    if (!response.ok) {
      console.error(
        " Device token save failed"
      );

      return false;
    }

    console.log(
      "FCM TOKEN SAVED SUCCESSFULLY"
    );

    return true;

  } catch (error) {
    console.error(
      " Device token save error:",
      error
    );

    return false;
  }
};


// FOREGROUND NOTIFICATIONS

export const listenForForegroundNotifications =
  async () => {
    try {
      if (!messaging) {
        console.error(
          " Firebase Messaging unavailable"
        );

        return () => {};
      }

      console.log(
        " Registering foreground FCM listener..."
      );

      const unsubscribe = onMessage(
        messaging,
        (payload) => {
          console.log(
            " FOREGROUND FCM MESSAGE RECEIVED:",
            payload
          );

          const notification =
            payload?.notification || {};

          const title =
            notification.title ||
            payload?.data?.title ||
            "Mamaearth";

          const message =
            notification.body ||
            payload?.data?.body ||
            "Welcome to Mamaearth!";

          console.log(
            " Showing foreground notification:",
            title,
            message
          );

          // Show browser notification
          if (
            "Notification" in window &&
            Notification.permission ===
              "granted"
          ) {
            const browserNotification =
              new Notification(
                title,
                {
                  body: message,
                  icon: "/logo192.png",
                  tag: "mamaearth-welcome",
                }
              );

            browserNotification.onclick =
              () => {
                window.focus();
                browserNotification.close();
              };
          } else {
            console.log(
              " Browser notification permission is not granted"
            );
          }
        }
      );

      console.log(
        " Foreground FCM listener registered"
      );

      return unsubscribe;

    } catch (error) {
      console.error(
        " Foreground notification listener error:",
        error
      );

      return () => {};
    }
  };
