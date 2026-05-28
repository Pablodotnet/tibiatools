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
      <div className="flex items-center justify-center min-h-screen" role="status">
        <svg
          className="size-8 animate-spin text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return status === 'authenticated'
    ? <>{children}</>
    : <Navigate to="/auth" replace />;
};
