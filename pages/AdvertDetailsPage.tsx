import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAdverts } from '../context/AdvertsContext';

export default function AdvertDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { getAdvert, deleteAdvert } = useAdverts();
  const navigate = useNavigate();

  const advert = getAdvert(id || '');

  if (!advert) {
    return <p className="empty-message">Объявление не найдено</p>;
  }

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить это объявление?')) {
      deleteAdvert(advert.id);
      navigate('/');
    }
  };

  const createDate = new Date(advert.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="details-page">
      <div className="details-card">
        <img
          src={advert.imageUrl || '/placeholder.jpg'}
          alt={advert.title}
          className="details-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.jpg';
          }}
        />
        <div className="details-info">
          <h2>{advert.title}</h2>
          <p className="details-price">{advert.price.toLocaleString()} ₽</p>
          <span className="details-category">{advert.category}</span>
          <p className="details-description">{advert.description}</p>
          <p className="details-date">Опубликовано: {createDate}</p>
          <div className="details-actions">
            <Link to={`/adverts/${advert.id}/edit`} className="btn btn-primary">
              Редактировать
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}