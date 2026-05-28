import { ThemeProvider } from '@/components/theme-provider';
import { NavBar } from '@/components/NavBar';
import { HashRouter } from 'react-router-dom';
import AppRouting from './routes';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FirebaseAuth } from '@/firebase/config';
import { login, logout } from '@/store/auth/authSlice';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';

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
        <HashRouter>
          <AuthStateListener />
          <NavBar />
          <div className='min-h-screen pt-14 w-full flex justify-center'>
            <div className='w-full max-w-6xl px-4'>
              <ErrorBoundary>
                <AppRouting />
              </ErrorBoundary>
            </div>
          </div>
          <Toaster richColors position='top-right' />
        </HashRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
