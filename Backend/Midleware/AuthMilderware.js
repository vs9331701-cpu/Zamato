const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'zamato-secret-key';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, mobile: user.mobile },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Token missing.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }
};

module.exports = { authMiddleware, generateToken };
