import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const useAppSelector = useSelector.withTypes<RootState>();

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
