const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(401).json({ 
        message: 'Access denied. No token provided.' 
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        message: 'Access denied. Invalid token format.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ 
        message: 'Access denied. User not found.' 
      });
    }

    // Add user to request object
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Access denied. Invalid token.' 
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Access denied. Token expired.' 
      });
    }

    res.status(500).json({ 
      message: 'Server error during authentication.',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

module.exports = auth;