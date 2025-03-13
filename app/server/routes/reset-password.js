const express = require('express');
const User = require('../models/Users'); // Assuming your user model is in the models folder
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const {sendEmailNotification} = require('../email/reset-password');
const bcrypt = require('bcryptjs');
const router = express.Router();



router.post('/reset-password-page', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Decode the JWT token to get the userId
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace with your secret key
    const userId = decoded.userId;

    // Find the user with the provided userId
    const user = await User.findOne({ _id: userId });

    if (!user || user.resetToken !== token || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.json({ message: 'Password successfully reset' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to reset password' });
  }
});



// 1. Password Reset Request Route (POST)
router.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    try {
      sendEmailNotification(user);
      res.status(200).json({ message: 'Reset password link sent to your email' });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send verification email');
    }
   

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;