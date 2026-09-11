import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD-Azs1eRYGtMGP08gZxhPolfUNTJ08ul8",
  authDomain: "fullstack-app-ea5cb.firebaseapp.com",
  databaseURL: "https://fullstack-app-ea5cb-default-rtdb.firebaseio.com",
  projectId: "fullstack-app-ea5cb",
  storageBucket: "fullstack-app-ea5cb.firebasestorage.app",
  messagingSenderId: "153972722342",
  appId: "1:153972722342:web:96e50b164e670ea4348267",
  measurementId: "G-420J4KJBM2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const analytics = getAnalytics(app);