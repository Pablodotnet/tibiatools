import { useAppSelector } from '@/hooks';
import { RootState } from '@/store';

export const useAuth = () => {
  const auth = useAppSelector((state: RootState) => state.auth);

  return {
    isAuthenticated: auth.status === 'authenticated',
    isChecking: auth.status === 'checking',
    user: {
      uid: auth.uid,
      email: auth.email,
      displayName: auth.displayName,
      photoURL: auth.photoURL,
    },
  };
};
