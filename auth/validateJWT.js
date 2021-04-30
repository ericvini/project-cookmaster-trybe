const jwt = require('jsonwebtoken');

const secret = 'meutoken';

 const validateJWT = async (req, res, next) => {
  const { authorization } = req.headers;
 
  if (!authorization) {
    return res.status(401).json({ message: 'missing auth token' });
  }
  try {
    const decoded = jwt.verify(authorization, secret);
    req.body.data = decoded.data;  
    next();
  } catch (err) {
    return res.status(401).json({ message: 'jwt malformed' });
  }
};

module.exports = validateJWT;