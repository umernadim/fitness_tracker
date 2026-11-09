const jwt = require('jsonwebtoken');

/**
 * Generate a signed JSON Web Token
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'fitnexus_super_secret_jwt_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

module.exports = generateToken;
