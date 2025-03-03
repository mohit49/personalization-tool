const mongoose = require("mongoose");

const launchSettingSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Project", // Reference to the Project model
  },
  settings: [
    {
      event: String,
      element: String,
      variable: String,
      customEvent: String,
      customCode: String,
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const LaunchSetting = mongoose.model("LaunchSetting", launchSettingSchema);
module.exports = LaunchSetting;
