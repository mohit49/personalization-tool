const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^([\w-]+(?:\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7})$/, 'Please fill a valid email address'],
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    //enum: ['male', 'female', 'other'], // Limit gender to these values
    required: true,
    minlength: 3,
  },
  emailVerified: {
    type: Boolean,
    default: false, // Default value will be false until the email is verified
  },
  phoneVerified: {
    type: Boolean,
    default: false, // Default value will be false until the phone is verified
  },

});

const User = mongoose.model('User', userSchema);

module.exports = User;
