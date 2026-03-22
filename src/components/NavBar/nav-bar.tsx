import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { PandaIcon } from "./panda-icon";
import { RepositoryButton } from "./repository-button";
import { AuthButton } from './auth-button';

export function NavBar() {
  return (
    <nav className='fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90'>
      <div className='w-full max-w-7xl mx-auto px-4'>
        <div className='flex justify-between h-14 items-center'>
          <Link to={'/'} className='flex items-center'>
            <PandaIcon className='h-6 w-6' />
            <span className='sr-only'>Tibia Tools</span>
          </Link>
          <nav className='hidden md:flex gap-4'>
            <Link
              to='/'
              className='font-medium flex items-center text-sm transition-colors hover:underline'
            >
              TIBIA TOOLS
            </Link>
          </nav>
          <div className='flex items-center gap-4'>
            <ModeToggle />
            <RepositoryButton />
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
