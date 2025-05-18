const mongoose = require('mongoose');

const ucidSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  ucid: {
    type: String,
    required: true,
    unique: true
  },
  ip: String,
  userAgent: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UCID', ucidSchema);
