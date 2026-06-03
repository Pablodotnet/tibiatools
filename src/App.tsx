import { ThemeProvider } from '@/components/theme-provider';
import { AppLayout } from '@/components/Layout';
import { BrowserRouter } from 'react-router-dom';
import AppRouting from './routes';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FirebaseAuth } from '@/firebase/config';
import { login, logout } from '@/store/auth/authSlice';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { QueryProvider } from '@/lib/query-provider';

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
      <QueryProvider>
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
          <BrowserRouter>
            <AuthStateListener />
            <AppLayout>
              <ErrorBoundary>
                <AppRouting />
              </ErrorBoundary>
            </AppLayout>
            <Toaster richColors position='top-right' />
          </BrowserRouter>
        </ThemeProvider>
      </QueryProvider>
    </Provider>
  );
}

export default App;
