// Load the appropriate environment file based on NODE_ENV (local, development, production)
const dotenv = require('dotenv');
const path = require('path');
const envFile = path.resolve(__dirname, '../../.env.' + (process.env.NODE_ENV || 'development'));
dotenv.config({ path: envFile });

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const saveLaunchSettings = require('../server/routes/launchSettingsController');
const authRoutes = require("../server/routes/auth");
const loginRoutes = require("../server/routes/login");
const userProfile = require("../server/routes/profile");
const verifyUser = require("../server/routes/varification");
const proxyRoute = require("./routes/proxy");
const projectRoutes = require("./routes/projectRoutes");
const activityRoute = require("./routes/activity");
const resetPasswprd = require("./routes/reset-password");
const uploadImage = require("./routes/uploadImage")
const getJs = require("./routes/getJs");
const tracking = require("./routes/tracking");
const ucidRegister = require("./routes/register-ucid");
// Fetch URL for CORS & API proxy from environment
const appUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'; // Default fallback

const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: appUrl, // This will be dynamically fetched based on the environment
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
const uploadsPath = path.join(process.cwd(), 'public');

app.use('/uploads', express.static(uploadsPath));
app.use(express.static("public"));

// ✅ MongoDB connection (Using either MongoDB URI or default localhost)
mongoose
  .connect("mongodb://localhost:27017/userRegistration", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/auth", loginRoutes);
app.use("/user", userProfile);
app.use("/auth", verifyUser);
app.use("/auth", projectRoutes); // Project API
app.use("/auth", activityRoute); // Activity API
app.use("/", proxyRoute); // Proxy Route
app.use("/auth", saveLaunchSettings); // Launch Settings API
app.use("/auth", resetPasswprd); 
app.use("/auth", uploadImage); 
app.use("/auth", tracking); 
app.use("/", getJs); 
app.use("/auth", ucidRegister); 

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the User Registration API");
});

// Start the server
const port = process.env.PORT || 5000; // Use port from environment or default to 5000
app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});
