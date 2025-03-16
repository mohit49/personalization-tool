const express = require("express");
const router = express.Router();
const Project = require("../models/Projects");
const Activity = require("../models/Activity");
const authenticateToken = require("../middleware/auth"); // Middleware for token verification

const eitherAuthenticateOrCors = require('../middleware/apiAuth');
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
    const status = activityStatus || 'inactive';

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
router.put("/project/:projectId/:activityId/update", authenticateToken, async (req, res) => {
  try {
    const { projectId, activityId } = req.params;
    const {
      activityName, availability, activityType, activityUrl, location, 
      email, htmlCode, cssCode, jsCode, jsonData, activityStatus
    } = req.body;

    const updatedBy = req.user.id;

    if (!activityId) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    if (availability === "local" && location && /\s/.test(location)) {
      return res.status(400).json({ message: "Location cannot contain spaces." });
    }

    const activity = await Activity.findOne({ _id: activityId, projectId });
    if (!activity) {
      return res.status(404).json({ message: "Activity not found or does not belong to the specified project." });
    }

    const fieldsToUpdate = {
      activityName,
      availability,
      activityType,
      activityUrl,
      location: availability === "local" ? location : undefined,
      activityStatus,
      updatedBy,
      updatedAt: new Date(),
    };

    const changes = [];

    for (const [key, newValue] of Object.entries(fieldsToUpdate)) {
      if (newValue === undefined) continue;

      const oldValue = activity[key];
      if (oldValue !== newValue) {
        changes.push({
          field: key,
          oldValue,
          newValue,
        });
        activity[key] = newValue;
      }
    }

    // Handle versioned fields - push to history arrays
    if (htmlCode) {
      if (Array.isArray(htmlCode)) {
        htmlCode.forEach(code => {
          activity.htmlCode.push({
            ...code,
            updatedAt: new Date(),
            updatedBy
          });
        });
      }
    }

    if (cssCode) {
      activity.cssCode.push({
        content: cssCode,
        updatedAt: new Date(),
        updatedBy
      });

      changes.push({
        field: "cssCode",
        oldValue: "Previous version retained",
        newValue: "New version added"
      });
    }

    if (jsCode) {
      activity.jsCode.push({
        content: jsCode,
        updatedAt: new Date(),
        updatedBy
      });

      changes.push({
        field: "jsCode",
        oldValue: "Previous version retained",
        newValue: "New version added"
      });
    }

    if (jsonData) {
      activity.jsonData.push({
        content: jsonData,
        updatedAt: new Date(),
        updatedBy
      });

      changes.push({
        field: "jsonData",
        oldValue: "Previous version retained",
        newValue: "New version added"
      });
    }

    if (changes.length === 0) {
      return res.status(400).json({ message: "No changes detected." });
    }

    activity.history.push({
      updatedAt: new Date(),
      updatedBy,
      changes,
    });

    await activity.save();

    res.status(200).json({
      message: "Activity updated successfully",
      activity,
    });

  } catch (error) {
    console.error("Update error:", error);
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

router.get("/project/:projectId/activities/live", eitherAuthenticateOrCors, async (req, res) => { 
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
router.get("/project/:projectId/activity/:activityId",  async (req, res) => {
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


router.delete("/project/:projectId/:activityId/code/:codeType/:index", authenticateToken, async (req, res) => {
  try {
      const { projectId, activityId, codeType, index } = req.params;

      const validTypes = ["htmlCode", "cssCode", "jsCode", "jsonData"];
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
