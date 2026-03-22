import { Routes, Route, Navigate } from 'react-router-dom';
import ExaltationPage from '@/pages/ExaltationPage';
import HomePage from '@/pages/HomePage';
import HuntingSpotsPage from '@/pages/HuntingSpotsPage';
import ImbuingsPage from '@/pages/ImbuingsPage';
import RealMoneyPage from '@/pages/RealMoneyPage';
import VocationHuntSpotsPage from '@/pages/VocationHuntSpotsPage';
import CoinsToMoneyPage from '@/pages/CoinsToMoneyPage';

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
      <Route path='/exaltation' element={<ExaltationPage />}></Route>
      <Route path='/*' element={<Navigate to='/auth/login' />} />
    </Routes>
  );
}

export default AppRouting;
