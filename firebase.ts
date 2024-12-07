import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD6olLyp59IGfcXilVwoWtqvfh2Z7FZnHQ",
    authDomain: "notion-clone-40fb2.firebaseapp.com",
    projectId: "notion-clone-40fb2",
    storageBucket: "notion-clone-40fb2.firebasestorage.app",
    messagingSenderId: "1049349756450",
    appId: "1:1049349756450:web:d17f4434e714c0b9055c7b"
  };

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app)

export {db};