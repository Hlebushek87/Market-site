import { useState, useEffect } from 'react';
import { useAdverts } from '../context/AdvertsContext';
import AdvertCard from '../components/AdvertCard';
import { CATEGORIES } from '../src/types';

export default function HomePage() {
  const { adverts, refreshAdverts } = useAdverts();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    refreshAdverts(search, selectedCategory);
  }, [search, selectedCategory, refreshAdverts]);

  return (
    <div className="home-page">
      <div className="filters">
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="">Все категории</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {adverts.length === 0 ? (
        <p className="empty-message">Ничего не найдено. Создайте первое объявление!</p>
      ) : (
        <div className="adverts-grid">
          {adverts.map((advert) => (
            <AdvertCard key={advert.id} advert={advert} />
          ))}
        </div>
      )}
    </div>
  );
}