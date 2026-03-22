import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  status: 'checking' | 'not-authenticated' | 'authenticated';
  uid: string | null;
  email: string | null;
  type: string | null;
  displayName: string | null;
  photoURL: string | null;
  errorMessage: string | null;
}

const initialState: AuthState = {
  // Start as 'checking' so the app waits for onAuthStateChanged
  // before deciding whether to redirect or render protected content.
  status: 'checking',
  uid: null,
  email: null,
  type: null,
  displayName: null,
  photoURL: null,
  errorMessage: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, { payload }: PayloadAction<Partial<AuthState>>) => {
      state.status = 'authenticated';
      state.uid = payload.uid ?? null;
      state.email = payload.email ?? null;
      state.type = payload.type ?? null;
      state.displayName = payload.displayName ?? null;
      state.photoURL = payload.photoURL ?? null;
      state.errorMessage = null;
    },
    logout: (
      state,
      { payload }: PayloadAction<{ errorMessage?: string } | undefined>,
    ) => {
      state.status = 'not-authenticated';
      state.uid = null;
      state.email = null;
      state.type = null;
      state.displayName = null;
      state.photoURL = null;
      state.errorMessage = payload?.errorMessage ?? null;
    },
    checkingCredentials: (state) => {
      state.status = 'checking';
    },
  },
});

export const { login, logout, checkingCredentials } = authSlice.actions;
