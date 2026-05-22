import { useState, useMemo } from 'react';
import { useAdverts } from '../context/AdvertsContext';
import AdvertCard from '../components/AdvertCard';
import { CATEGORIES } from '../src/types';

export default function HomePage() {
  const { adverts } = useAdverts();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filtered = useMemo(() => {
    return adverts.filter((advert) => {
      const matchesSearch = advert.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory ? advert.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [adverts, search, selectedCategory]);

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

      {filtered.length === 0 ? (
        <p className="empty-message">Ничего не найдено. Создайте первое объявление!</p>
      ) : (
        <div className="adverts-grid">
          {filtered.map((advert) => (
            <AdvertCard key={advert.id} advert={advert} />
          ))}
        </div>
      )}
    </div>
  );
}