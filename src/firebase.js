import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBzAT0Chvt7xBDf01TxaAYzfhSznr4qhck",
  authDomain: "sandunportfolio.firebaseapp.com",
  projectId: "sandunportfolio",
  storageBucket: "sandunportfolio.appspot.com",
  messagingSenderId: "367143211095",
  appId: "1:367143211095:web:0f0fb1db9b706b60b61312",
  measurementId: "G-MDMDYC2L3F"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
