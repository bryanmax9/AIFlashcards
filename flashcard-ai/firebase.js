// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBja_6ktYZKfJNAk1uJ9mUX3Ml_ZtMfJ8A",
  authDomain: "aiflashcards-95d92.firebaseapp.com",
  projectId: "aiflashcards-95d92",
  storageBucket: "aiflashcards-95d92.appspot.com",
  messagingSenderId: "587783781655",
  appId: "1:587783781655:web:10c486f5ced6df5d214b52",
  measurementId: "G-NR2WRBLEJM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
