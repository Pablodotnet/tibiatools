import { ThemeProvider } from '@/components/theme-provider';
import { NavBar } from '@/components/NavBar';
import { BrowserRouter } from 'react-router-dom';
import AppRouting from './routes';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FirebaseAuth } from '@/firebase/config';
import { login, logout } from '@/store/auth/authSlice';

// Inner component so it can access the store via hooks
function AuthStateListener() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FirebaseAuth, (user) => {
      if (user) {
        store.dispatch(
          login({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          }),
        );
      } else {
        store.dispatch(logout({}));
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <BrowserRouter>
          <AuthStateListener />
          <NavBar />
          <div className='flex flex-col items-center justify-center min-h-screen'>
            <AppRouting />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
