const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();
const usersFile = path.join(__dirname, '..', 'data', 'users.json');

function readUsers() {
  return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
}

function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Все поля обязательны' });
    }

    const users = readUsers();
    if (Object.values(users).some(u => u.email === email)) {
      return res.status(409).json({ message: 'Email уже занят' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const newUser = {
      id,
      name,
      email,
      password: hashedPassword,
      avatarUrl: '',
      settings: { darkTheme: false, notifications: true }
    };
    users[id] = newUser;
    writeUsers(users);

    const token = jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: {
        id, name, email,
        avatarUrl: newUser.avatarUrl,
        settings: newUser.settings
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Вход
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны' });
    }

    const users = readUsers();
    const user = Object.values(users).find(u => u.email === email);
    if (!user) return res.status(401).json({ message: 'Неверные учётные данные' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Неверные учётные данные' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        settings: user.settings
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;