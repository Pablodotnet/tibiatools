import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { FirebaseAuth, FirebaseDB } from './config';
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  collection,
} from 'firebase/firestore';
import { LoginParams, RegisterParams } from '@/types';

const googleProvider = new GoogleAuthProvider();

export const getCurrentUser = () => {
  return FirebaseAuth.currentUser;
};

export const getUsers = async () => {
  const usersRef = collection(FirebaseDB, 'users');
  const usersSnap = await getDocs(usersRef);
  const users: { uid: string; email: string; displayName: string | null }[] =
    [];
  usersSnap.forEach((doc) => {
    const data = doc.data();
    users.push({
      uid: doc.id,
      email: data.email,
      displayName: data.displayName || null,
    });
  });
  return users;
};

export const getUserById = async (uid: string) => {
  const userRef = doc(FirebaseDB, 'users', uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const data = userSnap.data();
    return {
      uid: userSnap.id,
      email: data.email,
      displayName: data.displayName || null,
      photoURL: data.photoURL || null,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
    };
  } else {
    return null;
  }
};

export const registerUserInFirestore = async () => {
  const user = FirebaseAuth.currentUser;
  if (!user) return;

  const userRef = doc(FirebaseDB, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: new Date(),
    });
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(FirebaseAuth, googleProvider);
    const { displayName, email, photoURL, uid } = result.user;
    return {
      ok: true,
      displayName,
      email,
      photoURL,
      uid,
    };
  } catch (error: unknown) {
    return {
      ok: false,
      errorMessage: (error as Error).message,
    };
  }
};

export const registerUserWithEmailPassword = async ({
  email,
  password,
  displayName,
}: RegisterParams) => {
  try {
    const resp = await createUserWithEmailAndPassword(
      FirebaseAuth,
      email,
      password
    );
    const { uid, photoURL } = resp.user;
    await updateProfile(FirebaseAuth.currentUser as User, {
      displayName,
      photoURL,
    });
    return {
      ok: true,
      uid,
      photoURL,
      email,
      displayName,
    };
  } catch (error: unknown) {
    return { ok: false, errorMessage: (error as Error).message };
  }
};

type LoginWithEmailPasswordResponse = {
  ok: boolean;
  uid?: string;
  photoURL?: string | null;
  email?: string;
  displayName?: string | null;
  errorMessage?: string | undefined;
};

export const loginWithEmailAndPassword = async ({
  email,
  password,
}: LoginParams): Promise<LoginWithEmailPasswordResponse> => {
  try {
    const resp = await signInWithEmailAndPassword(
      FirebaseAuth,
      email,
      password
    );
    const { uid, photoURL, displayName } = resp.user;
    return {
      ok: true,
      uid,
      photoURL,
      email,
      displayName,
    };
  } catch (error: unknown) {
    return { ok: false, errorMessage: (error as Error).message };
  }
};

export const logoutFirebase = async () => {
  return await FirebaseAuth.signOut();
};
