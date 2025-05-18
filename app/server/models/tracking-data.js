const mongoose = require("mongoose");

const trackingSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: "Activity", required: true },
  event: String,
  eventName: String,
  pageUrl: String,
  userId: String,
  timestamp: { type: Date, default: Date.now }
});

// Indexing for efficient hierarchy queries
trackingSchema.index({ projectId: 1, activityId: 1, timestamp: 1 });

module.exports = mongoose.model("Tracking", trackingSchema);
