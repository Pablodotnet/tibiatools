import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { PandaIcon } from './panda-icon';
import { RepositoryButton } from './repository-button';
import { AuthButton } from './auth-button';
import { LanguageSwitcher } from '../LanguageSwitcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { to: '/real-money-calculator', label: 'Real Money' },
  { to: '/coins-to-money', label: 'Coins to Money' },
  { to: '/imbuings', label: 'Imbuings' },
  { to: '/hunting-spots', label: 'Hunting Spots' },
  { to: '/exaltation', label: 'Exaltation Forge' },
  { to: '/myTierProjects', label: 'Tier Projects' },
  { to: '/public-projects', label: 'Community' },
];

export function NavBar() {
  return (
    <nav className='fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90 dark:border-b dark:border-gray-800 dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]'>
      <div className='w-full max-w-7xl mx-auto px-4'>
        <div className='relative flex justify-between h-14 items-center'>
          <Link to={'/'} className='flex items-center gap-2'>
            <PandaIcon className='h-6 w-6' />
            <span className='hidden text-sm font-semibold md:inline'>
              TIBIA TOOLS
            </span>
          </Link>

          <nav className='hidden md:flex absolute left-1/2 -translate-x-1/2 gap-4'>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className='text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400'
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className='flex items-center gap-2 md:gap-4'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='md:hidden'
                  aria-label='Navigation menu'
                >
                  <Menu className='size-5' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                {NAV_LINKS.map((link) => (
                  <DropdownMenuItem key={link.to} asChild>
                    <Link to={link.to} className='cursor-pointer'>
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

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
