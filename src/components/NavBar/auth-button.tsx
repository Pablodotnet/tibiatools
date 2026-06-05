import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/hooks';
import { RootState } from '@/store';
import { useNavigate } from 'react-router-dom';
import { UserCircle, LogIn } from 'lucide-react';

export function AuthButton() {
  const navigate = useNavigate();
  const { status } = useAppSelector((state: RootState) => state.auth);
  const isAuthenticated = status === 'authenticated';

  const handleClick = () => {
    navigate(isAuthenticated ? '/account' : '/auth');
  };

  return (
    <Button
      className='cursor-pointer'
      variant='outline'
      size='icon'
      onClick={handleClick}
      disabled={status === 'checking'}
      aria-label={isAuthenticated ? 'Go to Account Page' : 'Sign in'}
    >
      {isAuthenticated ? (
        <UserCircle data-icon className="size-5" />
      ) : (
        <LogIn data-icon className="size-5" />
      )}
    </Button>
  );
}
