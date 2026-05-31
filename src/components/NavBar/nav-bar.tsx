import { Link } from 'react-router-dom';
import { Menu, Wallet, Coins, Zap, Crosshair, Hammer, FolderKanban, Users } from 'lucide-react';
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

interface NavLink {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_LINKS: NavLink[] = [
  { to: '/real-money-calculator', label: 'Real Money', icon: Wallet },
  { to: '/coins-to-money', label: 'Coins to Money', icon: Coins },
  { to: '/imbuings', label: 'Imbuings', icon: Zap },
  { to: '/hunting-spots', label: 'Hunting Spots', icon: Crosshair },
  { to: '/exaltation', label: 'Exaltation Forge', icon: Hammer },
  { to: '/myTierProjects', label: 'Tier Projects', icon: FolderKanban },
  { to: '/public-projects', label: 'Community', icon: Users },
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
              <DropdownMenuContent align='end' className='w-72'>
                <div className='grid grid-cols-2 gap-1 p-1'>
                  {NAV_LINKS.map((link) => {
                    const Icon = link.icon;
                    return (
                      <DropdownMenuItem key={link.to} asChild className='flex-col items-center justify-center p-3 gap-1.5 text-center'>
                        <Link to={link.to} className='cursor-pointer'>
                          <Icon className='size-6' />
                          <span className='text-xs'>{link.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </div>
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
