import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import HomePage from '@/pages/HomePage';
import { PrivateRoute } from '@/components/Layout/PrivateRoute';
import { PublicRoute } from '@/components/Layout/PublicRoute';

const ExaltationPage = lazy(() => import('@/pages/ExaltationPage'));
const HuntingSpotsPage = lazy(() => import('@/pages/HuntingSpotsPage'));
const ImbuingsPage = lazy(() => import('@/pages/ImbuingsPage'));
const RealMoneyPage = lazy(() => import('@/pages/RealMoneyPage'));
const VocationHuntSpotsPage = lazy(() => import('@/pages/VocationHuntSpotsPage'));
const CoinsToMoneyPage = lazy(() => import('@/pages/CoinsToMoneyPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const AccountPage = lazy(() => import('@/pages/AccountPage'));
const MyTierProjectsPage = lazy(() => import('./pages/MyTierProjectsPage'));

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

const AppRouting = () => {
  return (
    <Suspense fallback={<PageFallback />}>
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
    </Suspense>
  );
};

export default AppRouting;
