export interface Advert {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  createdAt: string;
}

export const CATEGORIES = [
  'Электроника',
  'Одежда',
  'Мебель',
  'Автомобили',
  'Недвижимость',
  'Спорт',
  'Другое',
] as const;

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface UserSettings {
  darkTheme: boolean;
  notifications: boolean;
}