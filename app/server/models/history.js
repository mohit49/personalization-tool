const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Project", // Reference to the Project model
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // Reference to the User model
  },
  action: {
    type: String, // 'create', 'update'
    required: true,
  },
  previousSettings: {
    type: [Object], // Stores the previous settings before the update
  },
  newSettings: {
    type: [Object], // Stores the updated settings
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const History = mongoose.model("History", historySchema);
module.exports = History;
