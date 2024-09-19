import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyANBSKPufh6OwwRsxju3NwFcW_zFepXzS0",
    authDomain: "openchat-c8c21.firebaseapp.com",
    projectId: "openchat-c8c21",
    storageBucket: "openchat-c8c21.appspot.com",
    messagingSenderId: "15768721681",
    appId: "1:15768721681:web:277feeb064f65bf21a94b0",
    measurementId: "G-WEVSMS6985"
  };

  // Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebase_app;

  const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

 

  export const db = getFirestore(app);

