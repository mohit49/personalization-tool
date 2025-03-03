const express = require('express');
const authenticateToken = require('../middleware/auth'); // Middleware to verify token
const User = require('../models/Users'); // Your User model file path
const router = express.Router();

// Profile route - GET /api/user/profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    // Since the user is authenticated, `req.user` contains the logged-in user's data
    const user = req.user;

    // You can select specific fields to return
    const userProfile = {
      username: user.username,
      email: user.email,
      phone: user.phone,
      name: user.name,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      createdAt: user.createdAt,
    };

    return res.status(200).json(userProfile); // Send user profile data as response
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Route to get a user by ID - GET /api/user/:id
router.get('/profile/:id', authenticateToken, async (req, res) => {
  try {
    // Get user ID from the URL parameter
    const { id } = req.params;

    // Find the user in the database by ID
    const user = await User.findById(id);

    // If user not found, return an error response
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // You can select specific fields to return for the user
    const userProfile = {
      username: user.username,
      email: user.email,
      phone: user.phone,
      name: user.name,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      createdAt: user.createdAt,
    };

    return res.status(200).json(userProfile); // Send user data as response
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
