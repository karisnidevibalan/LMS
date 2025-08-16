// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Base authentication function
const authenticate = async (req, res, next) => {
  try {
    console.log('Base authenticate function called');
    
    // Get authorization header
    const authHeader = req.headers?.authorization;
    if (!authHeader) {
      console.log('No authorization header found');
      return res.status(401).json({ error: "Missing authorization header" });
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('No token found in header');
      return res.status(401).json({ error: 'No token found' });
    }

    console.log('Token found, verifying...');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);
    
    // Get full user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({ error: 'User not found' });
    }
    
    console.log('User found:', user.email, 'Role:', user.role);
    
    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Role-based authorization wrapper
const authMiddleware = (allowedRoles = []) => {
  console.log('authMiddleware called with roles:', allowedRoles);
  
  // Ensure allowedRoles is always an array
  if (!Array.isArray(allowedRoles)) {
    allowedRoles = [allowedRoles];
  }

  // Return the actual middleware function
  return (req, res, next) => {
    console.log('Middleware function executing');
    
    // First authenticate the user
    authenticate(req, res, (err) => {
      if (err) {
        console.log('Authentication failed');
        return next(err);
      }
      
      // Then check role permissions
      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        console.log('Role check failed. Required:', allowedRoles, 'User role:', req.user.role);
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      }

      console.log('Role check passed, proceeding to route handler');
      next();
    });
  };
};

module.exports = authMiddleware;
