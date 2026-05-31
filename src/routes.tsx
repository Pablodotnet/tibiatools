import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ExaltationPage from '@/pages/ExaltationPage';
import HomePage from '@/pages/HomePage';
import HuntingSpotsPage from '@/pages/HuntingSpotsPage';
import ImbuingsPage from '@/pages/ImbuingsPage';
import RealMoneyPage from '@/pages/RealMoneyPage';
import VocationHuntSpotsPage from '@/pages/VocationHuntSpotsPage';
import CoinsToMoneyPage from '@/pages/CoinsToMoneyPage';
import ImbueCostCalculatorPage from '@/pages/ImbueCostCalculatorPage';
import AuthPage from '@/pages/AuthPage';
import AccountPage from '@/pages/AccountPage';
import NotFoundPage from '@/pages/NotFoundPage';
import PublicTierProjectsPage from '@/pages/PublicTierProjectsPage';
import { PrivateRoute } from '@/components/Layout/PrivateRoute';
import { PublicRoute } from '@/components/Layout/PublicRoute';
import MyTierProjectsPage from './pages/MyTierProjectsPage';

const TITLE_KEYS: Record<string, string> = {
  '/': 'home',
  '/real-money-calculator': 'realMoneyCalculator',
  '/coins-to-money': 'coinsToMoney',
  '/imbuings': 'imbuings',
  '/hunting-spots': 'huntingSpots',
  '/imbue-cost-calculator': 'imbueCostCalculator',
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
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/real-money-calculator' element={<RealMoneyPage />} />
      <Route path='/coins-to-money' element={<CoinsToMoneyPage />} />
      <Route path='/imbuings' element={<ImbuingsPage />} />
      <Route path='/imbue-cost-calculator' element={<ImbueCostCalculatorPage />} />
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
  );
};

export default AppRouting;
