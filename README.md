# Доска объявлений (Adverts SPA)

Одностраничное приложение для размещения и просмотра объявлений о продаже.  
Выполнено на React + TypeScript + Vite.

Доступно в двух вариантах:
- **Только клиент** – все данные хранятся локально в localStorage браузера.
- **Клиент + API** – данные хранятся на сервере (Node.js + Express).

## 🚀 Быстрый старт (локально)

### 1. Клонируй репозиторий
```bash
git clone https://github.com/твой-юзернейм/твой-репозиторий.git
cd твой-репозиторий
2. Установи зависимости
bash
npm install
3. Запусти сервер разработки
bash
npm run dev
Открой http://localhost:5173 (или тот порт, который покажет Vite).
```

## 🔧 Сборка для продакшена
```
npm run build
```
Готовая статика появится в папке dist. Её можно заливать на любой хостинг (Beget, Netlify, Vercel).

## 🖥️ Версия с API (бэкенд)
Если нужен сервер с хранением данных (JSON-файлы или база), в папке server лежит готовый Express API.

### Запуск бэкенда локально
```bash
cd server
npm install
node index.js
```
Сервер слушает http://localhost:5000.

### Подключение клиента к API
В файле src/api.ts укажи адрес сервера:
```
const API_URL = 'http://localhost:5000/api';
```
Затем пересобери клиент: npm run build.


## 📁 Структура проекта
```
├── public/               # Статические файлы (placeholder.jpg, favicon)
├── server/               # Бэкенд (Express API)
│   ├── data/             # JSON-файлы с данными
│   ├── routes/           # Маршруты (auth, adverts, profile)
│   └── index.js          # Точка входа сервера
├── src/
│   ├── components/       # Переиспользуемые компоненты
│   ├── context/          # Глобальное состояние (Auth, Adverts)
│   ├── data/             # Тестовые объявления (mockAdverts)
│   ├── pages/            # Страницы приложения
│   ├── styles/           # Глобальные стили
│   ├── types.ts          # Типы TypeScript
│   └── api.ts            # Адрес API (только для версии с бэкендом)
├── index.html
├── vite.config.ts
└── package.json
```

## 🌐 Развёртывание
Клиент можно разместить на любом статическом хостинге (например, Beget, Netlify).
Для SPA-маршрутизации используется HashRouter, поэтому .htaccess не обязателен, но может быть добавлен для красоты URL.
Бэкенд рекомендуется деплоить на Railway, Render или любой VPS с Node.js.

## 📋 Основные команды
Команда	Назначение
npm install	Установка зависимостей
npm run dev	Запуск сервера разработки
npm run build	Сборка продакшен-версии
cd server && npm start	Запуск API локально
## ⚙️ Технологии
React 18 + TypeScript

Vite (сборка)

React Router v6 (маршрутизация)

CSS (чистый, без фреймворков)

localStorage (хранение в клиентской версии)

Node.js + Express (для API)

JWT (аутентификация в API)
