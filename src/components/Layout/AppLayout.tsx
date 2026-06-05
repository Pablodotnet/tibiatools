import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FocusTrap from 'focus-trap-react';
import {
  Wallet, Coins, Zap, Calculator, Sword, Shirt, Timer, TrendingUp,
  Crosshair, Hammer, FolderKanban, Users, Church, Menu, X, Home,
  ChevronDown, ChevronRight, Share2, HandCoins, Search, History, Clock, BookOpen, User,
} from 'lucide-react';
import { ModeToggle } from '@/components/NavBar/mode-toggle';
import { Separator } from '@/components/ui/separator';
import { PandaIcon } from '@/components/NavBar/panda-icon';
import { RepositoryButton } from '@/components/NavBar/repository-button';
import { AuthButton } from '@/components/NavBar/auth-button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { CommandPalette } from '@/components/CommandPalette';
import { OfflineBanner } from '@/components/OfflineBanner';
import { usePwaBadge } from '@/hooks/usePwaBadge';

export interface NavItem {
  to: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const NAV_GROUPS: { labelKey: string; items: NavItem[] }[] = [
  {
    labelKey: 'groupFinance',
    items: [
      { to: '/real-money-calculator', labelKey: 'realMoney', icon: Wallet },
      { to: '/coins-to-money', labelKey: 'coinsToMoney', icon: Coins },
      { to: '/imbue-cost-calculator', labelKey: 'imbueCostCalculator', icon: Calculator },
      { to: '/tibia-loot-split', labelKey: 'tibiaLootSplit', icon: HandCoins },
    ],
  },
  {
    labelKey: 'groupCombat',
    items: [
      { to: '/imbuings', labelKey: 'imbuings', icon: Zap },
      { to: '/exercise-weapons', labelKey: 'exerciseWeapons', icon: Sword },
      { to: '/equipment-reference', labelKey: 'equipmentReference', icon: Shirt },
      { to: '/bestiary', labelKey: 'bestiary', icon: BookOpen },
    ],
  },
  {
    labelKey: 'groupCalculators',
    items: [
      { to: '/level-calculator', labelKey: 'levelCalculator', icon: TrendingUp },
      { to: '/exp-share', labelKey: 'expShareCalculator', icon: Share2 },
      { to: '/bless-calculator', labelKey: 'blessCalculator', icon: Church },
      { to: '/offline-training', labelKey: 'offlineTraining', icon: Timer },
      { to: '/stamina-calculator', labelKey: 'staminaCalculator', icon: Timer },
    ],
  },
  {
    labelKey: 'groupHunting',
    items: [
      { to: '/hunting-spots', labelKey: 'huntingSpots', icon: Crosshair },
      { to: '/my-sessions', labelKey: 'mySessions', icon: History },
      { to: '/boss-cooldowns', labelKey: 'bossCooldownTracker', icon: Clock },
      { to: '/imbuement-tracker', labelKey: 'imbuementTracker', icon: Zap },
      { to: '/exaltation', labelKey: 'exaltationForge', icon: Hammer },
    ],
  },
  {
    labelKey: 'groupCommunity',
    items: [
      { to: '/myTierProjects', labelKey: 'tierProjects', icon: FolderKanban },
      { to: '/public-projects', labelKey: 'community', icon: Users },
      { to: '/characters', labelKey: 'characters', icon: User },
    ],
  },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const tl = (key: string) => t(`sidebar.${key}`);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem('tt-sidebar-groups');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed === 'object' && parsed !== null) return parsed;
      }
    } catch { /* ignore malformed JSON */ }
    const initial: Record<string, boolean> = {};
    NAV_GROUPS.forEach((g) => { initial[g.labelKey] = true; });
    return initial;
  });
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  usePwaBadge();

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem('tt-sidebar-groups', JSON.stringify(next));
      return next;
    });
  };

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Skip-to-content link */}
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:rounded-md focus:ring-2 focus:ring-ring'
      >
        {t('common.skipToContent')}
      </a>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-35 bg-black/50 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <FocusTrap active={sidebarOpen && window.innerWidth < 1024}>
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className='flex items-center justify-between h-14 px-4 border-b border-border shrink-0'>
          <Link to='/' className='flex items-center gap-2' onClick={() => setSidebarOpen(false)}>
            <PandaIcon className='h-6 w-6' />
            <span className='text-sm font-semibold'>{t('nav.title')}</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className='lg:hidden p-2.5 text-muted-foreground hover:text-foreground cursor-pointer focus-visible:outline-2 focus-visible:outline-ring min-h-[44px] min-w-[44px]'
            aria-label='Close sidebar'
          >
            <X className='size-5' />
          </button>
        </div>

        {/* User info */}
        {isAuthenticated ? (
          <Link
            to='/account'
            onClick={() => setSidebarOpen(false)}
            className='flex items-center gap-2.5 px-4 py-2.5 border-b border-border hover:bg-accent transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-ring'
          >
            <Avatar className='size-7'>
              {user.photoURL ? (
                <AvatarImage src={user.photoURL} alt={user.displayName ?? ''} />
              ) : (
                <AvatarFallback className='text-xs'>
                  {(user.displayName ?? '?').charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className='min-w-0'>
              <p className='text-sm font-medium truncate'>{user.displayName ?? t('common.player')}</p>
              <p className='text-[10px] text-muted-foreground truncate'>{t('account.title')}</p>
            </div>
          </Link>
        ) : (
          <Link
            to='/auth'
            onClick={() => setSidebarOpen(false)}
            className='flex items-center gap-2 px-4 py-2.5 border-b border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-ring'
          >
            <Avatar className='size-7'>
              <AvatarFallback className='text-xs text-muted-foreground bg-muted'>
                ?
              </AvatarFallback>
            </Avatar>
            <span>{t('auth.login')}</span>
          </Link>
        )}

        {/* Nav links */}
        <nav className='flex-1 overflow-y-auto py-2 px-2 space-y-1'>
          {/* Home link */}
          <NavLink
            to='/'
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors focus-visible:outline-2 focus-visible:outline-ring ${
                isActive
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`
            }
          >
            <Home className='size-4 shrink-0' />
            <span>{tl('home')}</span>
          </NavLink>

          <button
            onClick={() => setCommandPaletteOpen(true)}
            className='w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-ring'
          >
            <Search className='size-4 shrink-0' />
            <span className='flex-1 text-left'>{t('commandPalette.search')}</span>
            <kbd className='hidden sm:inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm font-mono'>
              <span>⌘</span>K
            </kbd>
          </button>

          <Separator className='my-1' />

          {NAV_GROUPS.map((group) => {
            const isExpanded = expandedGroups[group.labelKey];
            return (
              <div key={group.labelKey}>
                <button
                  onClick={() => toggleGroup(group.labelKey)}
                  className='w-full flex items-center justify-between px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-ring'
                >
                  {tl(group.labelKey)}
                  {isExpanded ? (
                    <ChevronDown className='size-3' />
                  ) : (
                    <ChevronRight className='size-3' />
                  )}
                </button>
                {isExpanded && (
                  <div className='space-y-0.5'>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.to);
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setSidebarOpen(false)}
                          className={`
                            flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors focus-visible:outline-2 focus-visible:outline-ring
                            ${active
                              ? 'bg-accent text-accent-foreground font-medium'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            }
                          `}
                        >
                          <Icon className='size-4 shrink-0' />
                          <span>{tl(item.labelKey)}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <Separator />
        <div className='p-3 flex items-center justify-between shrink-0'>
          <div className='flex items-center gap-2'>
            <LanguageSwitcher />
            <ModeToggle />
          </div>
          <div className='flex items-center gap-2'>
            <RepositoryButton />
            <AuthButton />
          </div>
        </div>
      </aside>
      </FocusTrap>

      {/* Main content */}
      <div className='lg:pl-64 min-h-screen flex flex-col'>
        {/* Mobile header */}
        <header className='lg:hidden flex items-center justify-between h-14 px-4 pt-[env(safe-area-inset-top)] border-b border-border bg-card sticky top-0 z-20'>
          <button
            onClick={() => setSidebarOpen(true)}
            className='p-2.5 text-muted-foreground hover:text-foreground cursor-pointer focus-visible:outline-2 focus-visible:outline-ring min-h-[44px] min-w-[44px]'
            aria-label='Open sidebar'
          >
            <Menu className='size-5' />
          </button>
          <Link to='/' className='flex items-center gap-2'>
            <PandaIcon className='h-5 w-5' />
            <span className='text-sm font-semibold'>{t('nav.title')}</span>
          </Link>
          <div className='flex items-center gap-1'>
            <LanguageSwitcher />
            <ModeToggle />
          </div>
        </header>

        {/* Page content */}
        <main id='main-content' className='flex-1 w-full max-w-6xl mx-auto px-4 py-6'>
          {children}
        </main>
      </div>
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
      <OfflineBanner />
    </div>
  );
}
