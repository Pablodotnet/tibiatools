
import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './auth/authSlice';
import { tierProjectsSlice } from './tierProjects/tierProjectsSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        tierProjects: tierProjectsSlice.reducer,
    },
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
