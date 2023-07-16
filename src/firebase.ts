import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider, OAuthProvider  } from "firebase/auth";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_CONFIG_APPIKEY,
    authDomain: import.meta.env.VITE_FIREBASE_CONFIG_AUTH,
    projectId: import.meta.env.VITE_FIREBASE_CONFIG_PROJECTID,
    storageBucket: import.meta.env.VITE_FIREBASE_CONFIG_STORAGE,
    messagingSenderId: import.meta.env.VITE_FIREBASE_CONFIG_MESSAGINGID,
    appId: import.meta.env.VITE_FIREBASE_CONFIG_APPID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

const googleProvider = new GoogleAuthProvider()
const microsoftProvider = new OAuthProvider("microsoft.com")

export {firebaseConfig, db, auth, googleProvider, microsoftProvider}