import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserSettings } from '../src/types';
import API_URL from '../src/api';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [settings, setSettings] = useState<UserSettings>({ darkTheme: false, notifications: true });

  // Применяем тёмную тему
  useEffect(() => {
    document.body.classList.toggle('dark-theme', settings.darkTheme);
  }, [settings.darkTheme]);

  // При старте пробуем загрузить профиль по токену
  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
          setUser({ id: data.id, name: data.name, email: data.email, avatarUrl: data.avatarUrl });
          setSettings(data.settings);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        });
    }
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser({ id: data.user.id, name: data.user.name, email: data.user.email, avatarUrl: data.user.avatarUrl });
    setSettings(data.user.settings);
    return true;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser({ id: data.user.id, name: data.user.name, email: data.user.email, avatarUrl: data.user.avatarUrl });
    setSettings(data.user.settings);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    const res = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      const updated = await res.json();
      setUser({ id: updated.id, name: updated.name, email: updated.email, avatarUrl: updated.avatarUrl });
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    const res = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ settings: updatedSettings })
    });
    if (res.ok) {
      const data = await res.json();
      setSettings(data.settings);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      token,
      login,
      register,
      logout,
      updateProfile,
      settings,
      updateSettings
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};