const express = require("express");
const router = express.Router();
const Project = require("../models/Projects");
const Activity = require("../models/Activity");
const authenticateToken = require("../middleware/auth"); // Middleware for token verification
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp"); // Import sharp for image processing

const createFolderIfNotExists = (projectId, activityId) => {
  const folderPath = `./public/uploads/${projectId}/${activityId}/`;
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  return folderPath;
};

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { projectId, activityId } = req.params; // Extract projectId and activityId from the route parameters
    const folderPath = createFolderIfNotExists(projectId, activityId);
    cb(null, folderPath); // Specify the folder to save the image
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname); // Add timestamp to avoid name conflicts
    cb(null, fileName);
  },
});

const upload = multer({ storage });

// File upload route for project and activity
router.post("/project/:projectId/activity/:activityId/uploadFile", authenticateToken, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const { projectId, activityId } = req.params;
  const filePath = path.join("uploads", projectId, activityId, req.file.filename);

  // Reduce the image quality by 30% using sharp
  const imagePath = path.join("./public", filePath); // Full path of the uploaded image
  const reducedImagePath = imagePath.replace(path.extname(imagePath), "_reduced.jpg");

  try {
    // Process the image to reduce its quality by 30%
    await sharp(imagePath)
      .jpeg({ quality: 70 }) // Reduce quality to 70% (30% reduction from 100%)
      .toFile(reducedImagePath);

    // You can store this reduced quality image path in your database or use it further as needed
    res.status(200).json({
      message: "File uploaded and quality reduced successfully!",
      filePath: "/static/" + filePath,
      reducedFilePath: "/static/" + path.basename(reducedImagePath), // Path for the reduced quality image
    });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).send("Error processing image.");
  }
});

// Your delete code route remains the same as before...
router.delete("/project/:projectId/:activityId/code/:codeType/:index", authenticateToken, async (req, res) => {
  try {
    const { projectId, activityId, codeType, index } = req.params;

    const validTypes = ["htmlCode", "cssCode", "jsCode", "jsonData", "tracking-added"];
    if (!validTypes.includes(codeType)) {
      return res.status(400).json({ message: "Invalid code type." });
    }

    const activity = await Activity.findOne({ _id: activityId, projectId });
    if (!activity) {
      return res.status(404).json({ message: "Activity not found." });
    }

    const codeArray = activity[codeType];
    if (!codeArray || !codeArray.some(item => item._id.toString() === index)) {
      return res.status(404).json({ message: "Item not found in " + codeType });
    }

    // Remove item by filtering out the one with the matching ID
    activity[codeType] = codeArray.filter(item => item._id.toString() !== index);

    // Save the updated activity
    await activity.save();

    res.status(200).json({
      message: `${codeType} item deleted successfully`,
      activity
    });
  } catch (error) {
    console.error("Delete code item error:", error);
    res.status(500).json({ message: "An error occurred while deleting the code item." });
  }
});

module.exports = router;
