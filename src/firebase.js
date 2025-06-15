import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB4ZR3MO9ngRpXpY__c30rhsActLF8WTxU",
  authDomain: "esha-portfolio-a82a9.firebaseapp.com",
  projectId: "esha-portfolio-a82a9",
  storageBucket: "esha-portfolio-a82a9.appspot.com", // fixed .app typo to .appspot.com
  messagingSenderId: "707594133368",
  appId: "1:707594133368:web:3755e035f6a619f982728d",
  measurementId: "G-VE6JDSFKGV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
