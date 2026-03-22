import { useAppSelector } from '@/hooks';
import { RootState } from '@/store';
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { status } = useAppSelector((state: RootState) => state.auth);

  if (status === 'checking') {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-muted-foreground animate-pulse'>Loading...</p>
      </div>
    );
  }

  return status === 'authenticated' ? (
    <Navigate to='/' replace />
  ) : (
    <>{children}</>
  );
};
