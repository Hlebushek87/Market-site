const express = require('express');
const fs = require('fs');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const usersFile = path.join(__dirname, '..', 'data', 'users.json');

function readUsers() {
  return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
}

function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Получить профиль
router.get('/', authenticateToken, (req, res) => {
  try {
    const users = readUsers();
    const user = users[req.user.id];
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      settings: user.settings
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить профиль
router.put('/', authenticateToken, (req, res) => {
  try {
    const users = readUsers();
    const user = users[req.user.id];
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    const { name, email, avatarUrl, settings } = req.body;
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    if (settings !== undefined) user.settings = { ...user.settings, ...settings };

    users[req.user.id] = user;
    writeUsers(users);
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      settings: user.settings
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;