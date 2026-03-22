// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDr--UEj8aAX8utnoeEq7UBodHBfx-qBvo',
  authDomain: 'tibiatools-fd53f.firebaseapp.com',
  projectId: 'tibiatools-fd53f',
  storageBucket: 'tibiatools-fd53f.firebasestorage.app',
  messagingSenderId: '255745501459',
  appId: '1:255745501459:web:bbc37af38bceaa3bfe92e6',
};

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseAuth = getAuth(FirebaseApp);
export const FirebaseDB = getFirestore(FirebaseApp);
