import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import HomePage from '../pages/HomePage';
import CreateAdvertPage from '../pages/CreateAdvertPage';
import AdvertDetailsPage from '../pages/AdvertDetailsPage';
import EditAdvertPage from '../pages/EditAdvertPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';
import { useAuth } from '../context/AuthContext';

// Компонент для защиты маршрутов
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateAdvertPage />
              </ProtectedRoute>
            }
          />
          <Route path="/adverts/:id" element={<AdvertDetailsPage />} />
          <Route
            path="/adverts/:id/edit"
            element={
              <ProtectedRoute>
                <EditAdvertPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}