import { Link, NavLink } from 'react-router-dom';
import { Menu, Wallet, Coins, Zap, Calculator, Sword, Shirt, Timer, Crosshair, Hammer, FolderKanban, Users } from 'lucide-react';
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
import { useTranslation } from 'react-i18next';

interface NavLink {
  to: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_LINKS: NavLink[] = [
  { to: '/real-money-calculator', labelKey: 'realMoney', icon: Wallet },
  { to: '/coins-to-money', labelKey: 'coinsToMoney', icon: Coins },
  { to: '/imbuings', labelKey: 'imbuings', icon: Zap },
  { to: '/imbue-cost-calculator', labelKey: 'imbueCostCalculator', icon: Calculator },
  { to: '/exercise-weapons', labelKey: 'exerciseWeapons', icon: Sword },
  { to: '/equipment-reference', labelKey: 'equipmentReference', icon: Shirt },
  { to: '/offline-training', labelKey: 'offlineTraining', icon: Timer },
  { to: '/hunting-spots', labelKey: 'huntingSpots', icon: Crosshair },
  { to: '/exaltation', labelKey: 'exaltationForge', icon: Hammer },
  { to: '/myTierProjects', labelKey: 'tierProjects', icon: FolderKanban },
  { to: '/public-projects', labelKey: 'community', icon: Users },
];

export function NavBar() {
  const { t } = useTranslation();
  const tl = (key: string) => t(`nav.links.${key}`);
  return (
    <nav className='fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90 dark:border-b dark:border-gray-800 dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]'>
      <div className='w-full max-w-7xl mx-auto px-4'>
        <div className='flex h-14 items-center'>
          <Link to={'/'} className='flex items-center gap-2 shrink-0'>
            <PandaIcon className='h-6 w-6' />
            <span className='hidden text-sm font-semibold md:inline'>
              {t('nav.title')}
            </span>
          </Link>

          <nav className='hidden md:flex items-center gap-1 ml-6'>
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  title={tl(link.labelKey)}
                  className={({ isActive }) =>
                    `flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`
                  }
                >
                  <Icon className='size-4 shrink-0' />
                </NavLink>
              );
            })}
          </nav>

          <div className='flex items-center gap-2 md:gap-4 ml-auto'>
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
                          <span className='text-xs'>{tl(link.labelKey)}</span>
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
