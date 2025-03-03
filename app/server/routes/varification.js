const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const router = express.Router();

// Email verification route
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;

  try {
    // Verify the token
    const decoded = jwt.verify(token, 'your_jwt_secret');
    
    // Find the user by ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update the user status to verified
    user.emailVerified = true;
    await user.save();

    res.status(200).json({ message: 'Account verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
