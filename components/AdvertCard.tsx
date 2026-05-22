import { Link } from 'react-router-dom';
import { Advert } from '../src/types';

interface Props {
  advert: Advert;
}

export default function AdvertCard({ advert }: Props) {
  return (
    <div className="advert-card">
      <img
        src={advert.imageUrl || '/placeholder.jpg'}
        alt={advert.title}
        className="advert-card__image"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder.jpg';
        }}
      />
      <div className="advert-card__info">
        <h3 className="advert-card__title">{advert.title}</h3>
        <p className="advert-card__price">{advert.price.toLocaleString()} ₽</p>
        <span className="advert-card__category">{advert.category}</span>
        <Link to={`/adverts/${advert.id}`} className="btn btn-secondary">
          Подробнее
        </Link>
      </div>
    </div>
  );
}