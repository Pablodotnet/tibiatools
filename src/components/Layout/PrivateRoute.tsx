import { useAppSelector } from '@/hooks';
import { RootState } from '@/store';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { status } = useAppSelector((state: RootState) => state.auth);

  if (status === 'checking') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground animate-pulse">Loading...</p>
      </div>
    );
  }

  return status === 'authenticated'
    ? <>{children}</>
    : <Navigate to="/auth" replace />;
};
