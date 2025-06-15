// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4ZR3MO9ngRpXpY__c30rhsActLF8WTxU",
  authDomain: "esha-portfolio-a82a9.firebaseapp.com",
  projectId: "esha-portfolio-a82a9",
  storageBucket: "esha-portfolio-a82a9.firebasestorage.app",
  messagingSenderId: "707594133368",
  appId: "1:707594133368:web:3755e035f6a619f982728d",
  measurementId: "G-VE6JDSFKGV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);