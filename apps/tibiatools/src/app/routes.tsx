import { Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages';

const AppRouting = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRouting;
