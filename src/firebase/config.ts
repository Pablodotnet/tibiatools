import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDr--UEj8aAX8utnoeEq7UBodHBfx-qBvo',
  authDomain: 'tibiatools-fd53f.firebaseapp.com',
  projectId: 'tibiatools-fd53f',
  storageBucket: 'tibiatools-fd53f.firebasestorage.app',
  messagingSenderId: '255745501459',
  appId: '1:255745501459:web:bbc37af38bceaa3bfe92e6',
};

export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseAuth = getAuth(FirebaseApp);
export const FirebaseDB = initializeFirestore(FirebaseApp, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});
