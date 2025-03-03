const jwt = require('jsonwebtoken');
const User = require('../models/Users'); // Your User model file path

// Secret key for JWT (same as the one used to sign the token)
const JWT_SECRET = 'your_secret_key'; // Replace with your actual secret key
const authenticateToken = async (req, res, next) => {
    const token = req?.cookies?.token; // Get token from cookies
  
    if (!token) {
      // If no token is found, return a message without failing
      return res.status(401).json({ message: 'You must be logged in to access this route.' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      // Find the user based on the user ID from the token
      const user = await User.findById(decoded.userId);
  
      if (!user) {
        return res.status(401).json({ message: 'User not found.' });
      }
  
      req.user = user; // Attach user info to the request object
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
  };
  
  module.exports = authenticateToken;