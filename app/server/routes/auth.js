const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const { sendVerificationEmail } = require('../email/verification-email'); // Import the email service

const router = express.Router();

// User registration route
router.post('/register', async (req, res) => {
  const { username, email, phone, password, name } = req.body;

  // Validate input
  if (!username || !email || !phone || !password || !name) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      name,
      emailVerified: false,  // Add a field to track if the user is verified
    });

    // Save the user to the database
    await newUser.save();

    // Generate a verification token
    const verificationToken = jwt.sign({ userId: newUser._id }, 'your_jwt_secret', { expiresIn: '1h' });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message: 'User registered successfully. Please check your email to verify your account.',
      user: { username, email, phone, name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
