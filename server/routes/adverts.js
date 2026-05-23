const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const advertsFile = path.join(__dirname, '..', 'data', 'adverts.json');

function readAdverts() {
  return JSON.parse(fs.readFileSync(advertsFile, 'utf8'));
}

function writeAdverts(adverts) {
  fs.writeFileSync(advertsFile, JSON.stringify(adverts, null, 2));
}

// Получить все объявления (с возможностью поиска и фильтрации)
router.get('/', (req, res) => {
  try {
    const adverts = readAdverts();
    const { search, category } = req.query;
    let filtered = adverts;

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(adv => adv.title.toLowerCase().includes(lowerSearch));
    }
    if (category) {
      filtered = filtered.filter(adv => adv.category === category);
    }

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить одно объявление
router.get('/:id', (req, res) => {
  try {
    const adverts = readAdverts();
    const advert = adverts.find(adv => adv.id === req.params.id);
    if (!advert) return res.status(404).json({ message: 'Объявление не найдено' });
    res.json(advert);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Создать объявление (только авторизованные)
router.post('/', authenticateToken, (req, res) => {
  try {
    const adverts = readAdverts();
    const { title, description, price, category, imageUrl } = req.body;

    if (!title || !description || price == null || !category) {
      return res.status(400).json({ message: 'Заполните обязательные поля' });
    }

    const newAdvert = {
      id: uuidv4(),
      title,
      description,
      price: Number(price),
      category,
      imageUrl: imageUrl || '',
      createdAt: new Date().toISOString(),
      authorId: req.user.id
    };

    adverts.push(newAdvert);
    writeAdverts(adverts);
    res.status(201).json(newAdvert);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить объявление (только автор)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const adverts = readAdverts();
    const index = adverts.findIndex(adv => adv.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Объявление не найдено' });

    const advert = adverts[index];
    if (advert.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Вы не можете редактировать чужое объявление' });
    }

    const { title, description, price, category, imageUrl } = req.body;
    if (title !== undefined) advert.title = title;
    if (description !== undefined) advert.description = description;
    if (price !== undefined) advert.price = Number(price);
    if (category !== undefined) advert.category = category;
    if (imageUrl !== undefined) advert.imageUrl = imageUrl;

    adverts[index] = advert;
    writeAdverts(adverts);
    res.json(advert);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить объявление (только автор)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    let adverts = readAdverts();
    const advert = adverts.find(adv => adv.id === req.params.id);
    if (!advert) return res.status(404).json({ message: 'Объявление не найдено' });

    if (advert.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Вы не можете удалить чужое объявление' });
    }

    adverts = adverts.filter(adv => adv.id !== req.params.id);
    writeAdverts(adverts);
    res.json({ message: 'Объявление удалено' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;