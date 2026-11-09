const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - Verifies JWT from Authorization header
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token provided. Please log in.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fitnexus_super_secret_jwt_key_2026'
    );

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(`[AuthMiddleware] Token verification failed: ${error.message}`);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authorization token. Please log in again.',
    });
  }
};

module.exports = { protect };
