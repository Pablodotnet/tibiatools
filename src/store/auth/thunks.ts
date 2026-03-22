
import { signInWithGoogle, registerUserWithEmailPassword, loginWithEmailAndPassword, logoutFirebase } from '@/firebase/providers';
import { RegisterParams, LoginParams } from '@/types';
import { AppDispatch } from '@/store';
import { checkingCredentials, login, logout } from './authSlice';

export const checkingAuthentication = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(checkingCredentials());
  };
};

export const startGoogleSignIn = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(checkingCredentials());
    const result = await signInWithGoogle();
    if (!result.ok) {
      return dispatch(logout(result.errorMessage));
    }
    return dispatch(login(result));
  };
};

export const startCreatingUserWithEmailPassword = ({
  email,
  password,
  displayName,
}: RegisterParams) => {
  return async (dispatch: AppDispatch) => {
    dispatch(checkingCredentials());
    const { ok, uid, photoURL, errorMessage } =
      await registerUserWithEmailPassword({
        email,
        password,
        displayName,
      });
    if (!ok) {
      return dispatch(logout({ errorMessage }));
    }
    dispatch(login({ uid, displayName, email, photoURL }));
  };
};

export const startLoginWithEmailPassword = ({
  email,
  password,
}: LoginParams) => {
  return async (dispatch: AppDispatch) => {
    dispatch(checkingCredentials());
    const { ok, uid, photoURL, displayName, errorMessage } =
      await loginWithEmailAndPassword({ email, password });
    if (!ok) {
      return dispatch(logout({ errorMessage }));
    }
    dispatch(login({ uid, displayName, email, photoURL }));
  };
};

export const startLogout = () => {
  return async (dispatch: AppDispatch) => {
    await logoutFirebase();
    dispatch(logout({}));
  };
};
