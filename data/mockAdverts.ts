import { Advert } from '../src/types';

export const initialAdverts: Advert[] = [
  {
    id: '1',
    title: 'iPhone 12 Pro',
    description: 'Продаю отличный iPhone 12 Pro в идеальном состоянии. 128GB.',
    price: 55000,
    category: 'Электроника',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLPLV1_xA8TOnmEurnNOqr7mS12d9sHuFSkA&s',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    title: 'Зимняя куртка',
    description: 'Тёплая мужская куртка, размер L. Носилась один сезон.',
    price: 8000,
    category: 'Одежда',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQogGlMYHjXROXiUlxF76rHxEKmB87UrGLDWg&s',
    createdAt: new Date('2024-02-10').toISOString(),
  },
  {
    id: '3',
    title: 'Диван угловой',
    description: 'Большой угловой диван, серый велюр. Состояние нового.',
    price: 35000,
    category: 'Мебель',
    imageUrl: 'https://s.pfst.net/2012.08/1426473818604c959a798c299d114c3aad9ace1fb8e_b.jpg',
    createdAt: new Date('2024-03-05').toISOString(),
  },
];