import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PrivateRoute } from '@/components/Layout/PrivateRoute';
import { PublicRoute } from '@/components/Layout/PublicRoute';

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
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const AccountPage = lazy(() => import('@/pages/AccountPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const PublicTierProjectsPage = lazy(() => import('@/pages/PublicTierProjectsPage'));
const MyTierProjectsPage = lazy(() => import('@/pages/MyTierProjectsPage'));

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
  '/exaltation': 'exaltationForge',
  '/auth': 'auth',
  '/account': 'account',
  '/myTierProjects': 'myTierProjects',
  '/public-projects': 'publicProjects',
};

const AppRouting = () => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const base = location.pathname.split('/').slice(0, 2).join('/') || '/';
    const key = TITLE_KEYS[base] || 'notFound';
    document.title = `${t(`pageTitles.${key}`)} — ${t('nav.title')}`;
  }, [location, t]);

  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path='/' element={<DashboardPage />} />
        <Route path='/real-money-calculator' element={<RealMoneyPage />} />
        <Route path='/coins-to-money' element={<CoinsToMoneyPage />} />
        <Route path='/imbuings' element={<ImbuingsPage />} />
        <Route path='/imbue-cost-calculator' element={<ImbueCostCalculatorPage />} />
        <Route path='/exercise-weapons' element={<ExerciseWeaponsCalculatorPage />} />
        <Route path='/equipment-reference' element={<EquipmentReferencePage />} />
        <Route path='/offline-training' element={<OfflineTrainingCalculatorPage />} />
        <Route path='/level-calculator' element={<LevelCalculatorPage />} />
        <Route path='/bless-calculator' element={<BlessCalculatorPage />} />
        <Route path='/exp-share' element={<ExpShareCalculatorPage />} />
        <Route path='/hunting-spots' element={<HuntingSpotsPage />} />
        <Route
          path='/hunting-spots/:vocationId'
          element={<VocationHuntSpotsPage />}
        />
        <Route path='/exaltation' element={<ExaltationPage />} />
        <Route
          path='/auth'
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />
        <Route
          path='/account'
          element={
            <PrivateRoute>
              <AccountPage />
            </PrivateRoute>
          }
        />
        <Route
          path='/myTierProjects'
          element={
            <PrivateRoute>
              <MyTierProjectsPage />
            </PrivateRoute>
          }
        />
        <Route path='/public-projects' element={<PublicTierProjectsPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouting;
