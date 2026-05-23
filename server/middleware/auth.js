const jwt = require('jsonwebtoken');

const JWT_SECRET = 'adverts_secret_key_change_in_production';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  if (!token) return res.status(401).json({ message: 'Требуется авторизация' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Неверный или истёкший токен' });
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken, JWT_SECRET };