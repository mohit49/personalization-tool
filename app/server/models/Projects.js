const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  domain: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jsFilePath: { type: String, required: true }, 
  // ✅ Add multiple users with roles
  users: [
    {
     
      role: { type: String, enum: ["admin", "developer", "observer", "editor" , "approver"], required: true },
      userId: {
        required: true,
        type: String,
        default: null, // Allow storing email when userId is not present
      },
    },
  ],
});

module.exports = mongoose.model("Project", projectSchema);
