const express = require("express");
const router = express.Router();
const path = require("path");
const externalFilePath = path.join(__dirname, '..', 'public/common/', 'externalFile.js');
const projects = require("../models/Projects");
const fs = require("fs");
const UglifyJS = require("uglify-js");
// File upload route for project and activity
router.get("/projects/:projectId", async (req, res) => {
  const { projectId } = req.params;

  // Strip both .js and .min.js for DB lookup
  const cleanId = projectId.replace(/\.min\.js$|\.js$/i, "");

  const projectData = await projects.findById(cleanId);

  if (!projectData) {
      return res.status(404).send('Project not found');
  }

  res.setHeader('Content-Type', 'application/javascript');

  const externalContent = fs.readFileSync(externalFilePath, 'utf-8');

  const script = `
      const project = {
          id: "${projectId}",
          name: "${projectData.projectName}",
          domain: "${projectData.domain}",
      };

      ${externalContent}

      console.log("Project Details:", project);
  `;

  // Check if it's a minified request
  if (projectId.endsWith(".min.js")) {
      const minified = UglifyJS.minify(script, {
          compress: {
              drop_console: true,
              passes: 2,
              dead_code: false,
              global_defs: {
                  DEBUG: true
              }
          },
          mangle: {
              toplevel: true
          },
          output: {
              comments: false,
              beautify: true // <- make it compact since it's minified
          }
      });

      if (minified.error) {
          console.error("Minification error:", minified.error);
          return res.status(500).send("Failed to minify script.");
      }

      return res.send(minified.code);
  }

  // If not .min.js, return as-is
  res.send(script);
});

module.exports = router;

