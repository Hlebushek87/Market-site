import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile, settings, updateSettings } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatarUrl: user?.avatarUrl || '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      });
    }
  }, [user]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateProfile(form);
    alert('Данные сохранены');
  };

  const handleToggleDark = () => {
    updateSettings({ darkTheme: !settings.darkTheme });
  };

  const handleToggleNotifications = () => {
    updateSettings({ notifications: !settings.notifications });
  };

  if (!user) return null;

  return (
    <div className="form-page">
      <h2>Профиль</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-field">
          <label htmlFor="name">Имя</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="form-field">
          <label htmlFor="avatarUrl">Аватар (URL)</label>
          <input
            id="avatarUrl"
            type="text"
            value={form.avatarUrl}
            onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
        {form.avatarUrl && (
          <div className="avatar-preview">
            <img src={form.avatarUrl} alt="Аватар" />
          </div>
        )}
        <button type="submit" className="btn btn-primary">Сохранить изменения</button>
      </form>

      <section className="settings-section">
        <h3>Настройки</h3>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.darkTheme}
              onChange={handleToggleDark}
            />
            Тёмная тема
          </label>
        </div>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={handleToggleNotifications}
            />
            Уведомления (тестовый переключатель)
          </label>
        </div>
      </section>
    </div>
  );
}