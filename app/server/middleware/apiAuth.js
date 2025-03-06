const jwt = require('jsonwebtoken');
const User = require('../models/Users'); // Your User model file path
const cors = require('cors'); // Ensure this is installed

const Poject = require("../models/Projects");
// Secret key for JWT (same as the one used to sign the token)
const JWT_SECRET = 'your_secret_key'; // Replace with your actual secret key

const dynamicCors = async (req, callback) => {
  const { projectId } = req.params;
  const origin = req.headers.origin;

  try {
    // Fetch allowed domains from the database
    const project = await Poject.findById(projectId); // Assuming you have a Project collection
    const extractHostname = (url) => {
      const match = url.match(/^(?:https?:\/\/)?([^\/:?#]+)/i);
      return match ? match[1] : null;
  };
    if (project.domain.includes(extractHostname(origin)) || (extractHostname(origin)== "app.mazzl.ae")) {
      callback(null, { origin: true }); // Allow this origin
    } else {
      callback(new Error("Not allowed by CORS")); // Deny this origin
    }
  } catch (error) {
    callback(new Error("Error checking CORS permissions"));
  }
};

const eitherAuthenticateOrCors = async (req, res, next) => {
    const token = req?.cookies?.token; // Get token from cookies

    if (token) {
        // Try token authentication first
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findById(decoded.userId);

            if (user) {
                req.user = user; // Attach user info to request
                return next(); // Token valid, continue
            } else {
                console.log('User not found, falling back to CORS');
            }
        } catch (error) {
            console.log('Token verification failed, falling back to CORS');
        }
    } else {
        console.log('No token found, falling back to CORS');
    }

    // If token auth fails (or no token), check dynamic CORS
    dynamicCors(req, (err, corsOptions) => {
        if (err) {
            return res.status(403).json({ error: "Access denied. Neither token nor CORS is valid." });
        }

        // Apply CORS headers and proceed
        cors(corsOptions)(req, res, next);
    });
};

module.exports = eitherAuthenticateOrCors;
