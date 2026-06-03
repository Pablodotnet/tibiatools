import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { FirebaseAuth } from './config';
import { LoginParams, RegisterParams } from '@/types';

const googleProvider = new GoogleAuthProvider();

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
