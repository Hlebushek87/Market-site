import { Advert } from '../src/types';

export const initialAdverts: Advert[] = [
  {
    id: '1',
    title: 'iPhone 12 Pro',
    description: 'Продаю отличный iPhone 12 Pro в идеальном состоянии. 128GB.',
    price: 55000,
    category: 'Электроника',
    imageUrl: 'https://www.yablokitradein.ru/image/cache/catalog/12%20pro%20iphone/iphone-12-pro-gold-hero-500x500.png',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    title: 'Зимняя куртка',
    description: 'Тёплая мужская куртка, размер L. Носилась один сезон.',
    price: 8000,
    category: 'Одежда',
    imageUrl: 'https://kioskstore.ru/media/catalog/product/cache/7/image/535x/040ec09b1e35df139433887a97daa66f/a/n/anteater-downjacket-combo-navy-2023-3_2.jpg',
    createdAt: new Date('2024-02-10').toISOString(),
  },
  {
    id: '3',
    title: 'Диван угловой',
    description: 'Большой угловой диван, серый велюр. Состояние: новое.',
    price: 35000,
    category: 'Мебель',
    imageUrl: 'https://ligadivanov.ru/upload/iblock/898/wgbu3vshxpacdw41hs2stxautkynreul.jpg',
    createdAt: new Date('2024-03-05').toISOString(),
  },
];