import { Link } from 'react-router-dom';
import { ModeToggle } from './mode-toggle';
import { PandaIcon } from './panda-icon';
import { RepositoryButton } from './repository-button';
import { AuthButton } from './auth-button';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useAuth } from '@/hooks';

export function NavBar() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className='fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90 dark:border-b dark:border-gray-800 dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]'>
      <div className='w-full max-w-7xl mx-auto px-4'>
        <div className='relative flex justify-between h-14 items-center'>
          <Link to={'/'} className='flex items-center'>
            <PandaIcon className='h-6 w-6' />
            <span className='sr-only'>Tibia Tools</span>
          </Link>

          <nav className='hidden md:flex absolute left-1/2 -translate-x-1/2 gap-6'>
            <Link
              to='/'
              className='font-medium flex items-center text-sm transition-colors hover:underline'
            >
              TIBIA TOOLS
            </Link>
            {isAuthenticated && (
              <Link
                to='/account'
                className='font-medium flex items-center text-sm text-muted-foreground transition-colors hover:underline'
              >
                Account
              </Link>
            )}
          </nav>

          <div className='flex items-center gap-4'>
            <LanguageSwitcher />
            <ModeToggle />
            <RepositoryButton />
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
