import { Navigate, Route, Routes } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import MyPage from './pages/MyPage';
import MovieListPage from './pages/MovieListPage';
import SignupPage from './pages/SignupPage';
import './App.css';
import { UserMoviesProvider } from './contexts/UserMoviesContext';

function App() {
  return (
    <UserMoviesProvider>
      <Routes>
        <Route path="/" element={<MovieListPage />} />
        <Route path="/search/:query" element={<MovieListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </UserMoviesProvider>
  );
}

export default App;
