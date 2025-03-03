const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/Users'); // Your User model file path
const router = express.Router();
const cors = require('cors');
require('dotenv').config(); // Load environment variables
const appUrl = process.env.NEXT_PUBLIC_URL 
// Use CORS middleware
router.use(
  cors({
    origin: appUrl, // Allow frontend origin
    credentials: true, // Allow cookies & authentication
    methods: ["GET", "POST", "PUT", "DELETE"], // Explicitly allow necessary methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow required headers
  })
);

// Secret key for JWT
const JWT_SECRET = 'your_secret_key'; // Change this to an environment variable for better security

// Login route
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body; // "identifier" could be email, username, or phone

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Please provide both identifier (email/username/phone) and password' });
  }

  try {
    // Check if the identifier is an email, username, or phone
    let user;

    if (identifier.includes('@')) {
      // It's an email address
      user = await User.findOne({ email: identifier });
    } else if (/^\d+$/.test(identifier)) {
      // It's a phone number (assuming only digits are present)
      user = await User.findOne({ phone: identifier });
    } else {
      // It's a username
      user = await User.findOne({ username: identifier });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Send token in cookies
    res.cookie('token', token, {
      httpOnly: false,  // Can't be accessed via JavaScript
      secure: process.env.NODE_ENV === 'production', // Secure cookies in production
      maxAge: 3600000, // 1 hour
      sameSite: 'Lax', // Required for cross-origin cookies
    });

    return res.status(200).json({ message: 'Login successful' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
