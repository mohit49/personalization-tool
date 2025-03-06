const express = require("express");
const LaunchSetting = require("../models/launch");
const History = require("../models/history");
const authenticateToken = require("../middleware/auth"); // Middleware for token verification
const router = express.Router();


const eitherAuthenticateOrCors = require('../middleware/apiAuth');
// Define your CORS options if needed (optional)






// ➤ Save Launch Settings for a Project
router.post("/launch-settings",  authenticateToken, async (req, res) => {
  try {
    const { projectId, settings } = req.body;
    const userId = req.user._id;
    if (!projectId  || !settings) {
      return res.status(400).json({ error: "Missing required parameters." });
    }

    // Retrieve the current launch settings for this project
    let currentSettings = await LaunchSetting.findOne({ projectId });

    // Track the action (update or create)
    let action = "create"; // Default action is 'create' for new settings
    let previousSettings = [];

    if (currentSettings) {
      action = "update"; // If settings already exist, it's an update
      previousSettings = currentSettings.settings; // Store the previous settings for history tracking
    }

    // Save or update the launch settings
    const launchSetting = await LaunchSetting.findOneAndUpdate(
      { projectId },
      {
        projectId,
        settings,
        createdBy: req.user._id,
        updatedAt: new Date(),
      },
      { new: true, upsert: true }
    );

    // Log the change in the History collection
    const history = new History({
      projectId,
      userId,
      action,
      previousSettings,
      newSettings: settings,
    });
    await history.save();

    return res.status(200).json({ message: "Launch settings saved successfully", launchSetting });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error saving launch settings." });
  }
});

// ➤ Get Launch Settings for a Project

router.get("/launch-settings/:projectId", eitherAuthenticateOrCors, async (req, res) => {
  try {
      const { projectId } = req.params;
      const launchSetting = await LaunchSetting.findOne({ projectId }).populate("createdBy", "username email role");

      if (!launchSetting) {
          return res.status(404).json({ error: "Launch settings not found for this project." });
      }

      res.json(launchSetting);
  } catch (error) {
      res.status(500).json({ error: "Error fetching launch settings." });
  }
});
// ➤ Get the History of Changes for Launch Settings
router.get("/launch-settings/history/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const history = await History.find({ projectId })
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    if (!history || history.length === 0) {
      return res.status(404).json({ error: "No history found for this project." });
    }

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Error fetching launch settings history." });
  }
});

// ➤ Update Launch Settings for a Project
router.put("/launch-settings/:projectId", authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const {settings } = req.body;
    const userId = req.user._id;
    if (!userId || !settings) {
      return res.status(400).json({ error: "User ID and settings are required." });
    }

    // Retrieve the current launch settings
    let currentSettings = await LaunchSetting.findOne({ projectId });

    if (!currentSettings) {
      return res.status(404).json({ error: "Launch settings not found." });
    }

    // Track the changes
    const previousSettings = currentSettings.settings;

    // Update the launch settings
    currentSettings.settings = settings;
    currentSettings.updatedAt = new Date();
    await currentSettings.save();

    // Log the update in the history collection
    const history = new History({
      projectId,
      userId,
      action: "update",
      previousSettings,
      newSettings: settings,
    });
    await history.save();

    res.status(200).json({ message: "Launch settings updated successfully", launchSetting: currentSettings });
  } catch (error) {
    res.status(500).json({ error: "Error updating launch settings." });
  }
});


// ➤ Delete an Event from Launch Settings for a Project and Update with New Settings, including deletion history
router.put("/launch-settings/:projectId/delete-event", authenticateToken, async (req, res) => {
    try {
      const { projectId } = req.params;
      const { event } = req.body; // event is the identifier to delete (e.g., the event name or other unique attribute)
      const userId = req.user._id;
      if (!userId || !event) {
        return res.status(400).json({ error: "User ID and event name are required." });
      }
  
      // Retrieve the current launch settings
      let currentSettings = await LaunchSetting.findOne({ projectId });
  
      if (!currentSettings) {
        return res.status(404).json({ error: "Launch settings not found." });
      }
  
      // Track the current settings before making the change
      const previousSettings = currentSettings.settings;
  
      // Find the event to delete
      const eventToDelete = currentSettings.settings.find(setting => setting.event === event);
  
      if (!eventToDelete) {
        return res.status(404).json({ error: `Event '${event}' not found in launch settings.` });
      }
  
      // Remove the event from the settings array
      currentSettings.settings = currentSettings.settings.filter(setting => setting.event !== event);
  
      // Save the updated launch settings
      currentSettings.updatedAt = new Date();
      await currentSettings.save();
  
      // Log the update in the history collection with the deletion details
      const history = new History({
        projectId,
        userId,
        action: "delete-event",
        previousSettings,
        newSettings: currentSettings.settings,
        deletedEvent: eventToDelete, // Store the event that was deleted for audit
      });
      await history.save();
  
      res.status(200).json({ message: "Event deleted and launch settings updated successfully", launchSetting: currentSettings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting event from launch settings." });
    }
  });
  
  

module.exports = router;
