import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Wallet, Coins, Zap, Calculator, Sword, Shirt, Timer, TrendingUp,
  Crosshair, Hammer, FolderKanban, Users, Church, Menu, X,
  ChevronDown, ChevronRight,
} from 'lucide-react';
import { ModeToggle } from '@/components/NavBar/mode-toggle';
import { PandaIcon } from '@/components/NavBar/panda-icon';
import { RepositoryButton } from '@/components/NavBar/repository-button';
import { AuthButton } from '@/components/NavBar/auth-button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface NavItem {
  to: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_GROUPS: { labelKey: string; items: NavItem[] }[] = [
  {
    labelKey: 'groupFinance',
    items: [
      { to: '/real-money-calculator', labelKey: 'realMoney', icon: Wallet },
      { to: '/coins-to-money', labelKey: 'coinsToMoney', icon: Coins },
      { to: '/imbue-cost-calculator', labelKey: 'imbueCostCalculator', icon: Calculator },
    ],
  },
  {
    labelKey: 'groupCombat',
    items: [
      { to: '/imbuings', labelKey: 'imbuings', icon: Zap },
      { to: '/exercise-weapons', labelKey: 'exerciseWeapons', icon: Sword },
      { to: '/equipment-reference', labelKey: 'equipmentReference', icon: Shirt },
      { to: '/bless-calculator', labelKey: 'blessCalculator', icon: Church },
    ],
  },
  {
    labelKey: 'groupCalculators',
    items: [
      { to: '/level-calculator', labelKey: 'levelCalculator', icon: TrendingUp },
      { to: '/offline-training', labelKey: 'offlineTraining', icon: Timer },
    ],
  },
  {
    labelKey: 'groupHunting',
    items: [
      { to: '/hunting-spots', labelKey: 'huntingSpots', icon: Crosshair },
      { to: '/exaltation', labelKey: 'exaltationForge', icon: Hammer },
    ],
  },
  {
    labelKey: 'groupCommunity',
    items: [
      { to: '/myTierProjects', labelKey: 'tierProjects', icon: FolderKanban },
      { to: '/public-projects', labelKey: 'community', icon: Users },
    ],
  },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const tl = (key: string) => t(`sidebar.${key}`);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    NAV_GROUPS.forEach((g) => { initial[g.labelKey] = true; });
    return initial;
  });
  const location = useLocation();

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border
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
            className='lg:hidden p-1 text-muted-foreground hover:text-foreground cursor-pointer'
          >
            <X className='size-5' />
          </button>
        </div>

        {/* Nav links */}
        <nav className='flex-1 overflow-y-auto py-2 px-2 space-y-1'>
          {NAV_GROUPS.map((group) => {
            const isExpanded = expandedGroups[group.labelKey];
            return (
              <div key={group.labelKey}>
                <button
                  onClick={() => toggleGroup(group.labelKey)}
                  className='w-full flex items-center justify-between px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer'
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
                            flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors
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
        <div className='border-t border-border p-3 flex items-center justify-between shrink-0'>
          <div className='flex items-center gap-1'>
            <LanguageSwitcher />
            <ModeToggle />
          </div>
          <div className='flex items-center gap-1'>
            <RepositoryButton />
            <AuthButton />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className='lg:pl-64 min-h-screen flex flex-col'>
        {/* Mobile header */}
        <header className='lg:hidden flex items-center justify-between h-14 px-4 border-b border-border bg-card sticky top-0 z-30'>
          <button
            onClick={() => setSidebarOpen(true)}
            className='p-1 text-muted-foreground hover:text-foreground cursor-pointer'
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
        <main className='flex-1 w-full max-w-6xl mx-auto px-4 py-6'>
          {children}
        </main>
      </div>
    </div>
  );
}
