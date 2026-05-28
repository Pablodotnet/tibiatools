import { Routes, Route, Navigate } from 'react-router-dom';
import ExaltationPage from '@/pages/ExaltationPage';
import HomePage from '@/pages/HomePage';
import HuntingSpotsPage from '@/pages/HuntingSpotsPage';
import ImbuingsPage from '@/pages/ImbuingsPage';
import RealMoneyPage from '@/pages/RealMoneyPage';
import VocationHuntSpotsPage from '@/pages/VocationHuntSpotsPage';
import CoinsToMoneyPage from '@/pages/CoinsToMoneyPage';
import AuthPage from '@/pages/AuthPage';
import AccountPage from '@/pages/AccountPage';
import { PrivateRoute } from '@/components/Layout/PrivateRoute';
import { PublicRoute } from '@/components/Layout/PublicRoute';
import MyTierProjectsPage from './pages/MyTierProjectsPage';

const AppRouting = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/real-money-calculator' element={<RealMoneyPage />} />
      <Route path='/coins-to-money' element={<CoinsToMoneyPage />} />
      <Route path='/imbuings' element={<ImbuingsPage />} />
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
      <Route path='/*' element={<Navigate to='/' />} />
    </Routes>
  );
};

export default AppRouting;
