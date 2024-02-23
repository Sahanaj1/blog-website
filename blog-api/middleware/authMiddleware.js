const jwt = require('jsonwebtoken');
const process = require('process'); 

module.exports = (req, res, next) => {
  if (req.path === '/auth/register' || req.path === '/auth/login') {
    next();
  } else {
    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          res.status(401).json({ error: 'Authentication failed' });
        } else {
          req.userId = decoded.userId;
          next();
        }
      });
    } else {
      res.status(401).json({ error: 'Authentication failed' });
    }
  }
};
