const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const authRoutes = require('./routes/auth');
const advertRoutes = require('./routes/adverts');
const profileRoutes = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 5000;

// Убедимся, что папка data существует
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
// Если файлы не существуют, создаём с пустыми массивами/объектами
const usersFile = path.join(dataDir, 'users.json');
const advertsFile = path.join(dataDir, 'adverts.json');
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, '{}');
if (!fs.existsSync(advertsFile)) fs.writeFileSync(advertsFile, '[]');

app.use(cors());
app.use(express.json());

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/adverts', advertRoutes);
app.use('/api/profile', profileRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'API сервер работает. Используйте /api/auth, /api/adverts и т.д.' });
});
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});