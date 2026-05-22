import { useNavigate } from 'react-router-dom';
import { useAdverts } from '../context/AdvertsContext';
import AdvertForm, { AdvertFormData } from '../components/AdvertForm';

export default function CreateAdvertPage() {
  const { addAdvert } = useAdverts();
  const navigate = useNavigate();

  const handleSubmit = (data: AdvertFormData) => {
    addAdvert(data);
    navigate('/');
  };

  return (
    <div className="form-page">
      <h2>Новое объявление</h2>
      <AdvertForm onSubmit={handleSubmit} submitLabel="Опубликовать" />
    </div>
  );
}