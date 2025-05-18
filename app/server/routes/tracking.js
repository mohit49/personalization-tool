const express = require("express");
const router = express.Router();
const Project = require("../models/Projects");
const Activity = require("../models/Activity");
const Tracking = require("../models/tracking-data");
const eitherAuthenticateOrCors = require("../middleware/apiAuth");

// Utility: Validate project and activity
const validateProjectAndActivity = async (projectId, activityId) => {
  const project = await Project.findById(projectId);
  if (!project) throw { status: 404, message: "Project not found" };

  const activity = await Activity.findOne({ _id: activityId, projectId });
  if (!activity) throw { status: 404, message: "Activity not found under project" };

  return { project, activity };
};

// Utility: Build match object for optional date range filtering
const buildMatchQuery = ({ projectId, activityId, startDate, endDate }) => {
  const match = { projectId };
  if (activityId) match.activityId = activityId;

  if (startDate && endDate) {
    match.timestamp = {
      $gte: new Date(startDate),
      $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
    };
  }

  return match;
};

// ✅ POST: Track activity
router.post("/tracking/:projectId/:activityId", eitherAuthenticateOrCors, async (req, res) => {
  try {
    const { projectId, activityId } = req.params;
    const { event, eventName, pageUrl, userId } = req.body;

    await validateProjectAndActivity(projectId, activityId);

    const newTracking = new Tracking({
      projectId,
      activityId,
      event,
      eventName,
      pageUrl,
      userId,
      timestamp: new Date()
    });

    await newTracking.save();
    res.status(200).json({ message: "Tracking saved successfully." });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Tracking error" });
  }
});

// ✅ GET: All tracking grouped by activity (with optional date filter)
router.get("/tracking/:projectId", eitherAuthenticateOrCors, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { startDate, endDate } = req.query;

    const match = buildMatchQuery({ projectId, startDate, endDate });

    const results = await Tracking.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$activityId",
          clicks: { $push: "$$ROOT" }
        }
      },
      {
        $lookup: {
          from: "activities",
          localField: "_id",
          foreignField: "_id",
          as: "activityDetails"
        }
      },
      {
        $project: {
          _id: 0,
          activityId: "$_id",
          activityDetails: { $arrayElemAt: ["$activityDetails", 0] },
          clicks: 1
        }
      }
    ]);

    res.status(200).json({ projectId, activities: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch project tracking data." });
  }
});

// ✅ GET: Specific activity tracking (with optional date filter)
router.get("/tracking/:projectId/:activityId", eitherAuthenticateOrCors, async (req, res) => {
  try {
    const { projectId, activityId } = req.params;
    const { startDate, endDate } = req.query;

    await validateProjectAndActivity(projectId, activityId);

    const match = buildMatchQuery({ projectId, activityId, startDate, endDate });

    const trackingData = await Tracking.find(match).sort({ timestamp: -1 });

    res.status(200).json({
      projectId,
      activityId,
      total: trackingData.length,
      data: trackingData
    });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Failed to fetch tracking" });
  }
});

module.exports = router;
