import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/hooks';
import { RootState } from '@/store';
import { useNavigate } from 'react-router-dom';

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
      aria-label={isAuthenticated ? 'Go to Account' : 'Go to Auth Page'}
    >
      {isAuthenticated ? (
        // User is logged in — show "account" person icon
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <circle cx='12' cy='8' r='4' />
          <path d='M4 20c0-4 3.6-7 8-7s8 3 8 7' />
        </svg>
      ) : (
        // User is logged out — show "login" arrow icon
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='m10 17 5-5-5-5' />
          <path d='M15 12H3' />
          <path d='M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4' />
        </svg>
      )}
    </Button>
  );
}
