import { lazy, Suspense, useEffect, useMemo } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { Loader2 } from 'lucide-react';
import { PrivateRoute } from '@/components/Layout/PrivateRoute';
import { PublicRoute } from '@/components/Layout/PublicRoute';
import { RouteErrorBoundaryWrapper } from '@/components/RouteErrorBoundary';

const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ExaltationPage = lazy(() => import('@/pages/ExaltationPage'));
const HuntingSpotsPage = lazy(() => import('@/pages/HuntingSpotsPage'));
const ImbuingsPage = lazy(() => import('@/pages/ImbuingsPage'));
const RealMoneyPage = lazy(() => import('@/pages/RealMoneyPage'));
const VocationHuntSpotsPage = lazy(() => import('@/pages/VocationHuntSpotsPage'));
const CoinsToMoneyPage = lazy(() => import('@/pages/CoinsToMoneyPage'));
const ImbueCostCalculatorPage = lazy(() => import('@/pages/ImbueCostCalculatorPage'));
const ExerciseWeaponsCalculatorPage = lazy(() => import('@/pages/ExerciseWeaponsCalculatorPage'));
const EquipmentReferencePage = lazy(() => import('@/pages/EquipmentReferencePage'));
const OfflineTrainingCalculatorPage = lazy(() => import('@/pages/OfflineTrainingCalculatorPage'));
const LevelCalculatorPage = lazy(() => import('@/pages/LevelCalculatorPage'));
const BlessCalculatorPage = lazy(() => import('@/pages/BlessCalculatorPage'));
const ExpShareCalculatorPage = lazy(() => import('@/pages/ExpShareCalculatorPage'));
const StaminaCalculatorPage = lazy(() => import('@/pages/StaminaCalculatorPage'));
const BossCooldownTrackerPage = lazy(() => import('@/pages/BossCooldownTrackerPage'));
const ImbuementTrackerPage = lazy(() => import('@/pages/ImbuementTrackerPage'));
const BestiaryPage = lazy(() => import('@/pages/BestiaryPage'));
const TibiaLootSplitPage = lazy(() => import('@/pages/TibiaLootSplitPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const AccountPage = lazy(() => import('@/pages/AccountPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const PublicTierProjectsPage = lazy(() => import('@/pages/PublicTierProjectsPage'));
const MyTierProjectsPage = lazy(() => import('@/pages/MyTierProjectsPage'));
const MySessionsPage = lazy(() => import('@/pages/MySessionsPage'));
const CharacterPage = lazy(() => import('@/pages/CharacterPage'));

const DESC_KEYS: Record<string, string> = {
  '/': 'home',
  '/real-money-calculator': 'realMoneyCalculator',
  '/coins-to-money': 'coinsToMoney',
  '/imbuings': 'imbuings',
  '/hunting-spots': 'huntingSpots',
  '/imbue-cost-calculator': 'imbueCostCalculator',
  '/exercise-weapons': 'exerciseWeapons',
  '/equipment-reference': 'equipmentReference',
  '/offline-training': 'offlineTraining',
  '/level-calculator': 'levelCalculator',
  '/bless-calculator': 'blessCalculator',
  '/exp-share': 'expShareCalculator',
  '/stamina-calculator': 'staminaCalculator',
  '/boss-cooldowns': 'bossCooldownTracker',
  '/imbuement-tracker': 'imbuementTracker',
  '/bestiary': 'bestiary',
  '/tibia-loot-split': 'tibiaLootSplit',
  '/exaltation': 'exaltationForge',
};

const TITLE_KEYS: Record<string, string> = {
  '/': 'home',
  '/real-money-calculator': 'realMoneyCalculator',
  '/coins-to-money': 'coinsToMoney',
  '/imbuings': 'imbuings',
  '/hunting-spots': 'huntingSpots',
  '/imbue-cost-calculator': 'imbueCostCalculator',
  '/exercise-weapons': 'exerciseWeapons',
  '/equipment-reference': 'equipmentReference',
  '/offline-training': 'offlineTraining',
  '/level-calculator': 'levelCalculator',
  '/bless-calculator': 'blessCalculator',
  '/exp-share': 'expShareCalculator',
  '/stamina-calculator': 'staminaCalculator',
  '/boss-cooldowns': 'bossCooldownTracker',
  '/imbuement-tracker': 'imbuementTracker',
  '/bestiary': 'bestiary',
  '/tibia-loot-split': 'tibiaLootSplit',
  '/exaltation': 'exaltationForge',
  '/auth': 'auth',
  '/account': 'account',
  '/myTierProjects': 'myTierProjects',
  '/my-sessions': 'mySessions',
  '/characters': 'characters',
  '/public-projects': 'publicProjects',
};

const AppRouting = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const base = useMemo(() => location.pathname.split('/').slice(0, 2).join('/') || '/', [location.pathname]);

  useEffect(() => {
    const key = TITLE_KEYS[base] || 'notFound';
    document.title = `${t(`pageTitles.${key}`)} — ${t('nav.title')}`;

    const descKey = DESC_KEYS[base] || 'notFound';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', t(`pageDescriptions.${descKey}`));

    document.documentElement.lang = i18n.language;
  }, [base, t]);

  return (
    <Suspense fallback={<div className='flex items-center justify-center py-32'><Loader2 className='size-8 animate-spin text-muted-foreground' /></div>}>
      <Routes>
        <Route path='/' element={<RouteErrorBoundaryWrapper><DashboardPage /></RouteErrorBoundaryWrapper>} />
        <Route path='/real-money-calculator' element={<RouteErrorBoundaryWrapper><RealMoneyPage /></RouteErrorBoundaryWrapper>} />
        <Route path='/coins-to-money' element={<RouteErrorBoundaryWrapper><CoinsToMoneyPage /></RouteErrorBoundaryWrapper>} />
        <Route path='/imbuings' element={<RouteErrorBoundaryWrapper><ImbuingsPage /></RouteErrorBoundaryWrapper>} />
        <Route path='/imbue-cost-calculator' element={<RouteErrorBoundaryWrapper><ImbueCostCalculatorPage /></RouteErrorBoundaryWrapper>} />
        <Route path='/exercise-weapons' element={<RouteErrorBoundaryWrapper><ExerciseWeaponsCalculatorPage /></RouteErrorBoundaryWrapper>} />
        <Route path='/equipment-reference' element={<RouteErrorBoundaryWrapper><EquipmentReferencePage /></RouteErrorBoundaryWrapper>} />
        <Route path='/offline-training' element={<RouteErrorBoundaryWrapper><OfflineTrainingCalculatorPage /></RouteErrorBoundaryWrapper>} />
        <Route path='/level-calculator' element={<RouteErrorBoundaryWrapper><LevelCalculatorPage /></RouteErrorBoundaryWrapper>} />
        <Route path='/bless-calculator' element={<RouteErrorBoundaryWrapper><BlessCalculatorPage /></RouteErrorBoundaryWrapper>} />
        <Route path='/exp-share' element={<RouteErrorBoundaryWrapper><ExpShareCalculatorPage /></RouteErrorBoundaryWrapper>} />
        <Route path='/stamina-calculator' element={<RouteErrorBoundaryWrapper><StaminaCalculatorPage /></RouteErrorBoundaryWrapper>} />
        <Route path='/boss-cooldowns' element={<RouteErrorBoundaryWrapper><BossCooldownTrackerPage /></RouteErrorBoundaryWrapper>} />
        <Route path='/imbuement-tracker' element={<RouteErrorBoundaryWrapper><ImbuementTrackerPage /></RouteErrorBoundaryWrapper>} />
        <Route path='/bestiary' element={<RouteErrorBoundaryWrapper><BestiaryPage /></RouteErrorBoundaryWrapper>} />
        <Route path='/tibia-loot-split' element={<RouteErrorBoundaryWrapper><TibiaLootSplitPage /></RouteErrorBoundaryWrapper>} />
        <Route path='/hunting-spots' element={<RouteErrorBoundaryWrapper><HuntingSpotsPage /></RouteErrorBoundaryWrapper>} />
        <Route
          path='/hunting-spots/:vocationId'
          element={<RouteErrorBoundaryWrapper><VocationHuntSpotsPage /></RouteErrorBoundaryWrapper>}
        />
        <Route path='/exaltation' element={<RouteErrorBoundaryWrapper><ExaltationPage /></RouteErrorBoundaryWrapper>} />
        <Route
          path='/auth'
          element={
            <PublicRoute>
              <RouteErrorBoundaryWrapper><AuthPage /></RouteErrorBoundaryWrapper>
            </PublicRoute>
          }
        />
        <Route
          path='/account'
          element={
            <PrivateRoute>
              <RouteErrorBoundaryWrapper><AccountPage /></RouteErrorBoundaryWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path='/myTierProjects'
          element={
            <PrivateRoute>
              <RouteErrorBoundaryWrapper><MyTierProjectsPage /></RouteErrorBoundaryWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path='/my-sessions'
          element={
            <PrivateRoute>
              <RouteErrorBoundaryWrapper><MySessionsPage /></RouteErrorBoundaryWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path='/characters'
          element={
            <PrivateRoute>
              <RouteErrorBoundaryWrapper><CharacterPage /></RouteErrorBoundaryWrapper>
            </PrivateRoute>
          }
        />
        <Route path='/public-projects' element={<RouteErrorBoundaryWrapper><PublicTierProjectsPage /></RouteErrorBoundaryWrapper>} />
        <Route path='/public-projects/:projectId' element={<RouteErrorBoundaryWrapper><PublicTierProjectsPage /></RouteErrorBoundaryWrapper>} />
        <Route path='*' element={<RouteErrorBoundaryWrapper><NotFoundPage /></RouteErrorBoundaryWrapper>} />
      </Routes>
    </Suspense>
  );
};

export default AppRouting;
