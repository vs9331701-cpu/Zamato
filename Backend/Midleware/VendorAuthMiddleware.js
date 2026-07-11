const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'zamato-secret-key';

const vendorAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Vendor token missing.' });
  }

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    if (decoded.role !== 'vendor') {
      return res.status(403).json({ error: 'Vendor access required.' });
    }
    req.vendor = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized. Invalid vendor token.' });
  }
};

module.exports = { vendorAuthMiddleware };
