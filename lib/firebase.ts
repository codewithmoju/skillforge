import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCBZrodncSQ-5oNeeTTiZgwPenp8eZMqQg",
    authDomain: "skill-forge-9e9c7.firebaseapp.com",
    projectId: "skill-forge-9e9c7",
    storageBucket: "skill-forge-9e9c7.firebasestorage.app",
    messagingSenderId: "149756044230",
    appId: "1:149756044230:web:cf803f7c3127e6589688c7",
    measurementId: "G-GDBC77EHFC"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
