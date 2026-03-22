import { Button } from "@/components/ui/button";
import { useAppSelector } from '@/hooks';
import { RootState } from '@/store';
import { useNavigate } from 'react-router-dom';

export function AuthButton() {
  const navigate = useNavigate();
  const { status } = useAppSelector((state: RootState) => state.auth);
  const isNotAuthenticated = status === 'not-authenticated';

  return (
    <Button
      className="cursor-pointer"
      variant='outline'
      size='icon'
      onClick={() => navigate('/auth')}
      aria-label='Go to Auth Page'
    >
      {isNotAuthenticated ? (
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
      ) : (
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
          <path d='m16 17 5-5-5-5' />
          <path d='M21 12H9' />
          <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
        </svg>
      )}
    </Button>
  );
}
