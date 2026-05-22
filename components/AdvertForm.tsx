import { useState, ChangeEvent, FormEvent } from 'react';
import { CATEGORIES } from '../src/types';

export interface AdvertFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

interface Props {
  initial?: AdvertFormData;
  onSubmit: (data: AdvertFormData) => void;
  submitLabel: string;
}

export default function AdvertForm({ initial, onSubmit, submitLabel }: Props) {
  const [form, setForm] = useState<AdvertFormData>(
    initial || {
      title: '',
      description: '',
      price: 0,
      category: CATEGORIES[0],
      imageUrl: '',
    }
  );
  const [errors, setErrors] = useState<Partial<Record<keyof AdvertFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.title.trim()) newErrors.title = 'Название обязательно';
    if (!form.description.trim()) newErrors.description = 'Описание обязательно';
    if (form.price <= 0) newErrors.price = 'Цена должна быть больше нуля';
    if (!form.category) newErrors.category = 'Выберите категорию';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  return (
    <form className="advert-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="title">Название</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="Введите название"
        />
        {errors.title && <span className="error">{errors.title}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="description">Описание</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          placeholder="Опишите товар"
        />
        {errors.description && <span className="error">{errors.description}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="price">Цена (₽)</label>
        <input
          id="price"
          name="price"
          type="number"
          min={0}
          value={form.price}
          onChange={handleChange}
        />
        {errors.price && <span className="error">{errors.price}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="category">Категория</label>
        <select id="category" name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <span className="error">{errors.category}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="imageUrl">Ссылка на изображение</label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="text"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {form.imageUrl && (
        <div className="form-image-preview">
          <img src={form.imageUrl} alt="Предпросмотр" onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }} />
        </div>
      )}

      <button type="submit" className="btn btn-primary">
        {submitLabel}
      </button>
    </form>
  );
}