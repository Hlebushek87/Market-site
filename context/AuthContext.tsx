import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserSettings } from '../src/types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Имитация базы пользователей в localStorage под ключом "users"
const USERS_KEY = 'adverts_users';
const CURRENT_USER_KEY = 'adverts_current_user';
const SETTINGS_KEY = 'adverts_settings';

function getUsers(): Record<string, { id: string; name: string; email: string; password: string; avatarUrl: string }> {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : {};
}

function saveUsers(users: Record<string, any>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<UserSettings>(() => {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : { darkTheme: false, notifications: true };
  });

  // При монтировании проверяем, сохранён ли текущий пользователь
  useEffect(() => {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      } catch {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
  }, []);

  // Применяем тёмную тему глобально
  useEffect(() => {
    document.body.classList.toggle('dark-theme', settings.darkTheme);
  }, [settings.darkTheme]);

  const login = (email: string, password: string): boolean => {
    const users = getUsers();
    const found = Object.values(users).find(u => u.email === email && u.password === password);
    if (!found) return false;
    const userData: User = {
      id: found.id,
      name: found.name,
      email: found.email,
      avatarUrl: found.avatarUrl || '',
    };
    setUser(userData);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    return true;
  };

  const register = (name: string, email: string, password: string): boolean => {
    const users = getUsers();
    if (Object.values(users).some(u => u.email === email)) return false;
    const id = Date.now().toString();
    const newUser = { id, name, email, password, avatarUrl: '' };
    users[id] = newUser;
    saveUsers(users);
    // Автоматически входим после регистрации
    const userData: User = { id, name, email, avatarUrl: '' };
    setUser(userData);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
    // Также обновляем в базе пользователей
    const users = getUsers();
    if (users[user.id]) {
      users[user.id] = { ...users[user.id], name: updated.name, email: updated.email, avatarUrl: updated.avatarUrl };
      saveUsers(users);
    }
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateProfile,
      settings,
      updateSettings,
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