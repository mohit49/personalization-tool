const express = require("express");
const router = express.Router();
const Project = require("../models/Projects");
const Activity = require("../models/Activity");
const authenticateToken = require("../middleware/auth"); // Middleware for token verification

// POST route to create an activity under a specific project
router.post("/project/:projectId/create", authenticateToken, async (req, res) => {
  try {
    const { activityName, availability, activityType, activityUrl, location, email, htmlCode, cssCode, jsCode, jsonData, activityStatus } = req.body;
    const { projectId } = req.params;
    const id = req.user._id;

    const createdBy = id; // Assume user is logged in and stored in req.user

    // Validate the necessary fields
    if (!activityName || !availability || !activityType || !activityUrl || !projectId) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // If location is provided and availability is "local", check that location does not contain spaces
    if (availability === "local" && location && /\s/.test(location)) {
      return res.status(400).json({ message: "Location cannot contain spaces." });
    }

    // Find the project by projectId to ensure the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Check if an activity with the same name already exists in the project
    const existingActivity = await Activity.findOne({ activityName, projectId });
    if (existingActivity) {
      return res.status(400).json({ message: "Activity with this name already exists in the project." });
    }

    // Set the activity status to 'drafted' if not provided
    const status = activityStatus || 'drafted';

    // Create the new activity
    const newActivity = new Activity({
      activityName,
      availability,
      activityType,
      activityUrl,
      location: availability === "local" ? location : undefined, // Only store location if it's a local activity
      projectId,
      createdBy,
      updatedBy: createdBy, // Initially, the creator is also the last person to update
      createdAt: new Date(),
      updatedAt: new Date(),
      history: [], // Initialize empty history array
      htmlCode,
      cssCode,
      jsCode,
      jsonData,
      activityStatus: status // Add the status
    });

    // Save the new activity in the Activity schema
    await newActivity.save();

    // Get the updated list of activities for the project
    const activities = await Activity.find({ projectId });

    // Respond with the success message and activities under the project
    res.status(201).json({
      message: "Activity created successfully",
      projectId: project._id,
      activities: activities
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while creating the activity." });
  }
});

// PUT route to update activity details by activityId and projectId
router.put("/project/:projectId/:activityId/update", async (req, res) => {
  try {
    const { projectId, activityId } = req.params;
    const { activityName, availability, activityType, activityUrl, location, email, htmlCode, cssCode, jsCode, jsonData, activityStatus } = req.body;
    const updatedBy = email; // Assume user is logged in and stored in req.user

    // Validate the necessary fields
    if (!activityName || !availability || !activityType || !activityUrl) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // If location is provided and availability is "local", check that location does not contain spaces
    if (availability === "local" && location && /\s/.test(location)) {
      return res.status(400).json({ message: "Location cannot contain spaces." });
    }

    // Find the activity by activityId and projectId
    const activity = await Activity.findOne({ _id: activityId, projectId });
    if (!activity) {
      return res.status(404).json({ message: "Activity not found or does not belong to the specified project." });
    }

    const changes = [];

    // Compare the old values with the new values and store the changes
    if (activity.activityName !== activityName) {
      changes.push({ field: 'activityName', oldValue: activity.activityName, newValue: activityName });
    }
    if (activity.availability !== availability) {
      changes.push({ field: 'availability', oldValue: activity.availability, newValue: availability });
    }
    if (activity.activityType !== activityType) {
      changes.push({ field: 'activityType', oldValue: activity.activityType, newValue: activityType });
    }
    if (activity.activityUrl !== activityUrl) {
      changes.push({ field: 'activityUrl', oldValue: activity.activityUrl, newValue: activityUrl });
    }
    if (activity.location !== location) {
      changes.push({ field: 'location', oldValue: activity.location, newValue: location });
    }
    
    // Track changes in the code fields (htmlCode, cssCode, jsCode, jsonData)
    if (activity.htmlCode !== htmlCode) {
      changes.push({ field: 'htmlCode', oldValue: activity.htmlCode, newValue: htmlCode });
    }
    if (activity.cssCode !== cssCode) {
      changes.push({ field: 'cssCode', oldValue: activity.cssCode, newValue: cssCode });
    }
    if (activity.jsCode !== jsCode) {
      changes.push({ field: 'jsCode', oldValue: activity.jsCode, newValue: jsCode });
    }
    if (JSON.stringify(activity.jsonData) !== JSON.stringify(jsonData)) {
      changes.push({ field: 'jsonData', oldValue: JSON.stringify(activity.jsonData), newValue: JSON.stringify(jsonData) });
    }

    // Track changes to the status field
    if (activity.activityStatus !== activityStatus) {
      changes.push({ field: 'activityStatus', oldValue: activity.activityStatus, newValue: activityStatus });
    }

    if (changes.length > 0) {
      // Add the changes to the history array
      activity.history.push({
        updatedAt: new Date(),
        updatedBy: updatedBy,
        changes: changes
      });

      // Update the activity details
      activity.activityName = activityName;
      activity.availability = availability;
      activity.activityType = activityType;
      activity.activityUrl = activityUrl;
      activity.location = availability === "local" ? location : undefined; // Only update location if it's a local activity
      activity.htmlCode = htmlCode;   // Update HTML code
      activity.cssCode = cssCode;     // Update CSS code
      activity.jsCode = jsCode;       // Update JavaScript code
      activity.jsonData = jsonData;   // Update JSON data
      activity.activityStatus = activityStatus; // Update activity status
      activity.updatedBy = updatedBy; // Track who updated the activity
      activity.updatedAt = new Date(); // Update the timestamp

      // Save the updated activity
      await activity.save();

      // Respond with the updated activity
      res.status(200).json({
        message: "Activity updated successfully",
        activity: activity
      });
    } else {
      res.status(400).json({ message: "No changes detected." });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating the activity." });
  }
});

// New route to fetch all activities for a project
router.get("/project/:projectId/activities", async (req, res) => {
  try {
    const { projectId } = req.params;

    // Find the project to ensure it exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Fetch all activities for the specified project
    const activities = await Activity.find({ projectId });

    // Respond with the activities
    res.status(200).json({
      message: "Activities fetched successfully",
      activities: activities
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching activities." });
  }
});

router.get("/project/:projectId/activities/live", async (req, res) => { 
  try {
    const { projectId } = req.params;

    // Find the project to ensure it exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Fetch only live activities for the specified project
    const activities = await Activity.find({ projectId, activityStatus: "live" });

    // Respond with the activities
    res.status(200).json({
      message: "Live activities fetched successfully",
      activities: activities
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching live activities." });
  }
});


// New DELETE route to remove an activity
router.delete("/project/:projectId/:activityId/delete", authenticateToken, async (req, res) => {
  try {
    const { projectId, activityId } = req.params;

    // Find the project to ensure it exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Find the activity to be deleted
    const activity = await Activity.findOne({ _id: activityId, projectId });
    if (!activity) {
      return res.status(404).json({ message: "Activity not found or does not belong to the specified project." });
    }

    // Delete the activity
    await Activity.deleteOne({ _id: activityId });

    // Respond with a success message
    res.status(200).json({
      message: "Activity deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while deleting the activity." });
  }
});


// New route to fetch a specific activity by activityId and projectId
router.get("/project/:projectId/activity/:activityId", async (req, res) => {
  try {
    const { projectId, activityId } = req.params;

    // Find the project to ensure it exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Find the activity by activityId and projectId
    const activity = await Activity.findOne({ _id: activityId, projectId });
    if (!activity) {
      return res.status(404).json({ message: "Activity not found or does not belong to the specified project." });
    }

    // Respond with the found activity
    res.status(200).json({
      message: "Activity fetched successfully",
      activity: activity
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching the activity." });
  }
});

module.exports = router;
