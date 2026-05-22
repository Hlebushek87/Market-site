import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        <h1>Доска объявлений</h1>
      </Link>
      <div className="header-actions">
        {location.pathname === '/' && isAuthenticated && (
          <Link to="/create" className="btn btn-primary">
            + Разместить объявление
          </Link>
        )}
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="btn btn-secondary">
              {user?.name || 'Профиль'}
            </Link>
            <button onClick={handleLogout} className="btn btn-secondary">
              Выйти
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary">
            Войти
          </Link>
        )}
      </div>
    </header>
  );
}