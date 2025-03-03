const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Project = require("../models/Projects");
const authenticateToken = require("../middleware/auth"); // Middleware for token verification
const { sendEmailNotification } = require('../email/user-added'); 
const router = express.Router();
const externalFilePath = path.join(__dirname, '..', 'public/common/', 'externalFile.js');
// ✅ Multer storage setup for dynamic folder creation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { projectName } = req.body;
    if (!projectName) {
      return cb(new Error("Project name is required"), null);
    }

    const dateFolder = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const uploadPath = `./public/uploads/${projectName.toLowerCase().replace(' ','-').trim()}/${dateFolder}/logo`;

    // ✅ Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ➤ Create a new project with an uploaded image
router.post("/project", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { projectName, domain } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const dateFolder = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const imageURL = `/uploads/${projectName}/${dateFolder}/logo/${req.file.filename}`;

    const newProject = new Project({
      projectName,
      domain,
      imageURL,
      createdBy: req.user.id, // Get user ID from authentication middleware
    });

    const externalContent = fs.readFileSync(externalFilePath, 'utf-8');

    // Generate the JavaScript file with the project details
    const projectId = newProject._id;  // Get the project ID
    const projectFileName = `${projectId}.js`;  // Name the file after the project ID

    const jsContent = `
      const project = {
        id: "${projectId}",
        name: "${projectName}",
        domain: "${domain}",
        imageURL: "${imageURL}",
        createdAt: "${newProject.createdAt}"
      };
       ${externalContent}
      console.log("Project Details:", project);
      // Add any other logic or functionality you want in the JS file
    `;

    const jsFilePath = path.join(__dirname, "..", "public/projects", projectName.toLowerCase().replace(' ','-').trim(), projectFileName);

    // Ensure the "projects" folder exists
    fs.mkdirSync(path.join(__dirname, "..", "public/projects", projectName.toLowerCase().replace(' ','-').trim()), { recursive: true });

    // Write the JavaScript content to the file
    fs.writeFileSync(jsFilePath, jsContent, "utf-8");

    // Store the JS file path in the database
    newProject.jsFilePath = jsFilePath;
    await newProject.save();

    console.log(`JavaScript file created for project ${projectId}`);

    res.status(201).json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    res.status(500).json({ error: "Error creating project" });
  }
});

// ➤ Get all projects
router.get("/project", authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find().populate("createdBy", "username email role");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Error fetching projects" });
  }
});

// ➤ Get project by ID
router.get("/project/:id", authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("createdBy", "username email role");
    if (!project) return res.status(404).json({ error: "Project not found" });

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Error fetching project" });
  }
});

// ➤ Update project by ID
router.put("/project/:id", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { projectName, domain } = req.body;
    let imageURL = null;

    if (req.file) {
      const dateFolder = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      imageURL = `/uploads/${projectName}/${dateFolder}/logo/${req.file.filename}`;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        projectName: projectName || undefined,
        domain: domain || undefined,
        imageURL: imageURL || undefined,
      },
      { new: true }
    ).populate("createdBy", "username email role");

    if (!updatedProject) return res.status(404).json({ error: "Project not found" });

    res.json({ message: "Project updated successfully", project: updatedProject });
  } catch (error) {
    res.status(500).json({ error: "Error updating project" });
  }
});

// ➤ Delete project by ID
router.delete("/project/:id", authenticateToken, async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) return res.status(404).json({ error: "Project not found" });

    // Delete the project folder and uploaded files
    const projectFolder = path.join(__dirname, "..", "public", "uploads", deletedProject.projectName);
    const projectJsFile = deletedProject.jsFilePath; // JS file path to delete

    // Delete JS file if it exists
    if (fs.existsSync(projectJsFile)) {
      fs.unlinkSync(projectJsFile);  // Delete the JavaScript file
      console.log(`Deleted JavaScript file: ${projectJsFile}`);
    }

    // Delete the project folder and uploaded images
    if (fs.existsSync(projectFolder)) {
      fs.rmSync(projectFolder, { recursive: true, force: true });  // Remove folder and contents
      console.log(`Deleted project folder: ${projectFolder}`);
    }

    res.json({ message: "Project deleted successfully", project: deletedProject });
  } catch (error) {
    res.status(500).json({ error: "Error deleting project" });
  }
});

// ➤ Add users to a project
router.put("/project/:id/add-users", authenticateToken, async (req, res) => {
  try {
    const { users } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    // ✅ Add new users while avoiding duplicates
    users.forEach((newUser) => {
      if (!project.users.some((u) => u.userId.toString() === newUser.userId)) {
        project.users.push(newUser);
        sendEmailNotification(newUser.userId, project);
      }
    });

    await project.save();
    res.json({ message: "Users added successfully", project });
  
  } catch (error) {
    res.status(500).json({ error: "Error adding users to project" });
  }
});

// ➤ Remove a user from a project
router.put("/project/:id/remove-users", authenticateToken, async (req, res) => {
  try {
    const { userIds } = req.body;  // Expecting an array of userIds to remove
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ error: "Project not found" });

    // ✅ Filter out the users from the project
    project.users = project.users.filter((user) => !userIds.includes(user.userId.toString()));

    await project.save();  // Save the updated project

    res.json({
      message: `${userIds.length} users removed from project successfully`,
      project
    });
  } catch (error) {
    res.status(500).json({ error: "Error removing users from project" });
  }
});

module.exports = router;
