const jwt = require('jsonwebtoken');
const dataService = require('../services/dataService');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'foodbridge_super_secret_jwt_key_998811'
      );

      const user = await dataService.findUserById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists',
        });
      }

      if (user.status === 'suspended') {
        return res.status(403).json({
          success: false,
          message: 'Account is suspended. Please contact administrator.',
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('Auth protect error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed or expired',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no authorization token provided',
    });
  }
};

module.exports = { protect };
