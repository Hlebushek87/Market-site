import { useParams, useNavigate } from 'react-router-dom';
import { useAdverts } from '../context/AdvertsContext';
import AdvertForm, { AdvertFormData } from '../components/AdvertForm';

export default function EditAdvertPage() {
  const { id } = useParams<{ id: string }>();
  const { getAdvert, updateAdvert } = useAdverts();
  const navigate = useNavigate();
  const advert = getAdvert(id || '');

  if (!advert) {
    return <p className="empty-message">Объявление не найдено</p>;
  }

  const handleSubmit = (data: AdvertFormData) => {
    updateAdvert({ ...data, id: advert.id, createdAt: advert.createdAt });
    navigate(`/adverts/${advert.id}`);
  };

  return (
    <div className="form-page">
      <h2>Редактировать объявление</h2>
      <AdvertForm
        initial={{
          title: advert.title,
          description: advert.description,
          price: advert.price,
          category: advert.category,
          imageUrl: advert.imageUrl,
        }}
        onSubmit={handleSubmit}
        submitLabel="Сохранить"
      />
    </div>
  );
}