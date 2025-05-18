const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const UCID = require("../models/UCID");
const project = require("../models/Projects");
const eitherAuthenticateOrCors = require("../middleware/apiAuth");

// Cookie name to use
const COOKIE_NAME = "ucid";

router.post("/ucid/:projectId", eitherAuthenticateOrCors, async (req, res) => {
  try {
    const { projectId } = req.params;
    const foundProject = await project.findById(projectId);
    if (!foundProject) {
      return res.status(404).json({ message: "Project not found." });
    }
    // 1. Check if UCID cookie already exists
    const existingCookie = req.cookies?.[COOKIE_NAME];
    if (existingCookie) {
      return res.status(200).json({ ucid: existingCookie });
    }

    // 2. Generate UCID from system info
    const userAgent = req.headers["user-agent"] || "";
    const acceptLanguage = req.headers["accept-language"] || "";
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    const rawId = `${userAgent}-${acceptLanguage}`;
    const ucid = crypto.createHash("sha256").update(rawId).digest("hex");

    // 3. Save to DB (only if not already saved)
    const existing = await UCID.findOne({ ucid });
    if (!existing) {
      const newUCID = new UCID({
        projectId,
        ucid,
        ip,
        userAgent,
      });
      await newUCID.save();
    }

    // 4. Set UCID as HTTP-only cookie (valid for 1 year)
    res.cookie(COOKIE_NAME, ucid, {
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
      httpOnly: false, // <-- allow JavaScript access
      secure: true, // <-- must be HTTPS in cross-domain
      sameSite: "None", // <-- required for cross-site
      domain: foundProject.domain, // <-- allow usage on this domain (leading dot makes it work for subdomains too)
    });

    // 5. Return response
    res.status(201).json({ ucid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while creating UCID." });
  }
});

router.get("/ucids/:projectId", eitherAuthenticateOrCors, async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify the project exists
    const foundProject = await project.findById(projectId);
    if (!foundProject) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Find all UCID entries for the project
    const ucids = await UCID.find({ projectId });

    // Return all UCIDs
    res.status(200).json({ projectId, ucids });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving UCID data." });
  }
});

module.exports = router;
