// models/Activity.js

const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  activityName: { type: String, required: true },
  availability: { type: String, required: true },
  activityType: { type: String, required: true },
  activityUrl: { type: String, required: true },
  location: { type: String }, // Optional, only for local activities
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: false }, // Track who created the activity
  updatedBy: { type: String, required: true }, // Track who last updated the activity
  history: [
    {
      updatedAt: { type: Date, default: Date.now },
      updatedBy: { type: String, required: true },
      changes: [
        {
          field: { type: String },
          oldValue: { type: mongoose.Schema.Types.Mixed },
          newValue: { type: mongoose.Schema.Types.Mixed }
          
        }
      ]
    }
  ],
  htmlCode: [
    {
      type: { type: String, required: true },
      selector: { type: String, required: true },
      newText: { type: String, required: true },
      settings:{ type: Object, required: false },
      updatedAt: { type: Date, default: Date.now },
      updatedBy: { type: String }
    }
  ],
  cssCode: [
    {
      content: { type: String },
      updatedAt: { type: Date, default: Date.now },
      updatedBy: { type: String }
    }
  ],
  jsCode: [
    {
      content: { type: String },
      updatedAt: { type: Date, default: Date.now },
      updatedBy: { type: String }
    }
  ],
  jsonData: [
    {
      content: { type: mongoose.Schema.Types.Mixed },
      updatedAt: { type: Date, default: Date.now },
      updatedBy: { type: String }
    }
  ],
  activityStatus: { 
    type: String, 
    enum: ['live', 'inactive', 'drafted', 'archived'], 
    default: 'drafted' // Default status when activity is created
  }
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
