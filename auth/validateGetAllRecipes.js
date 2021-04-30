const jwt = require('jsonwebtoken');

const secret = 'meutoken';

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return next();
  }
  try {
    const decoded = jwt.verify(token, secret);
    req.data = decoded.data;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ message: 'jwt malformed' });
  }
};
