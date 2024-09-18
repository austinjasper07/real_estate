// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  apiKey: "AIzaSyCCHXLzgZANPb7sTXoJupratjjuOWJhHZg",
  authDomain: "crystal-estate-2a0ac.firebaseapp.com",
  projectId: "crystal-estate-2a0ac",
  storageBucket: "crystal-estate-2a0ac.appspot.com",
  messagingSenderId: "888713399736",
  appId: "1:888713399736:web:806b7a8cda88acd484934d",
  measurementId: "G-1VF1HV4BG7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
