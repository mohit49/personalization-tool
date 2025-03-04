// utils/api.js
"use client";
import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_NODE_API_URL;

import { useState , useCallback } from 'react';

/**
 * Registers a new user by sending a POST request to the API.
 * @param {Object} userData - The user data to be sent in the request.
 * @returns {Promise<Object>} - The response data from the API.
 */
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/register`, userData, {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'An error occurred during registration.');
  }
};


export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/login`,
        { identifier: email, password }, // ✅ Only send user data here
        { 
          headers: { "Content-Type": "application/json" }, // ✅ Correct header placement
          withCredentials: true  // ✅ Ensure cookies are included
        }
      );
      
      setIsLoading(false);
      return response.data; // ✅ Return the login response data

    } catch (err) {
      setIsLoading(false);
      setError("Login failed. Please check your credentials.");
      return null;
    }
  };

  return { login, isLoading, error };
};

export const fetchUserProfile = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/user/profile`, {
      method: "GET",
      credentials: "include", // Ensures cookies are sent with the request
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};


export async function addProject(projectData) {
  try {
    const formData = new FormData();
    formData.append("projectName", projectData.projectname);
    formData.append("domain", projectData.domain);
    if (projectData.image) {
      formData.append("image", projectData.image);
    }

    const response = await axios.post(`${apiUrl}/api/auth/project`, formData, {
      withCredentials: true, // ✅ Sends cookies or authentication headers
      headers: {
        "Content-Type": "multipart/form-data", // ✅ Required for file upload
      },
    });

    return { success: true, message: "Project added successfully!", data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.error || "Something went wrong" };
  }
}




export async function getProjects() {
  try {
    const response = await axios.get(`${apiUrl}/api/auth/project/`,{
      withCredentials: true, // ✅ Sends cookies or authentication headers
      headers: {
        "Content-Type": "multipart/form-data", // ✅ Required for file upload
      },
    }); // Adjust the API URL if needed
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch projects" };
  }
}




// Create an Axios instance with default settings
const apiClient = axios.create({
  baseURL: `${apiUrl}/api/auth`,
  withCredentials: true, // Include credentials (cookies, authentication tokens)
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch project by ID
export const fetchProjectById = async (id) => {
  if (!id) return null;

  try {
    const response = await apiClient.get(`/project/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};



export const deleteProject =async (projectId) => {
    try {
      const response = await axios.delete(`${apiUrl}/api/auth/project/${projectId}`,{
        withCredentials: true, // ✅ Sends cookies or authentication headers
        headers: {
          "Content-Type": "multipart/form-data", // ✅ Required for file upload
        },
      });
      
      return response.data;
    } catch (error) {
      console.error("Error deleting project:", error.response?.data || error.message);
      throw error;
    }
  };


// Function to submit users data to the API
export const submitUsers = async (users , projectId) => {
  try {
    const response = await axios.put(`${apiUrl}/api/auth/project/${projectId}/add-users`, users , {
      withCredentials: true, // ✅ Sends cookies or authentication headers
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // Return the response data if successful
  } catch (error) {
    console.error("Error submitting users:", error);
    throw error; // Throw the error to be caught in the calling component
  }
};




export const fetchActivitiesByProject = async (projectId) => {
  try {
    const response = await axios.get(`${apiUrl}/api/auth/project/${projectId}/activities`,{
      withCredentials: true, // ✅ Sends cookies or authentication headers
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.activities;
  } catch (error) {
    console.error("Error fetching activities:", error);
    throw error;
  }
};




export const   deleteUsersFromProject = async (payload, projectId) => {
  try {
    const response = await axios.put(`${apiUrl}/api/auth/project/${projectId}/remove-users`, payload, {
      withCredentials: true, // ✅ Sends cookies or authentication headers
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;  // Return the response data
  } catch (error) {
    throw new Error('Failed to remove users: ' + error.response?.data?.error || error.message);
  }
}


export const createActivity = async (projectId, activityData) => {
  try {
    // Sending the POST request using axios
    const response = await axios.post(
      `${apiUrl}/api/auth/project/${projectId}/create`,
      activityData, // Send the activity data in the body
      {
        withCredentials: true, // Sends cookies or authentication headers
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data; // Axios automatically returns the data from the response
  } catch (error) {
    // Handle errors from the request
    throw new Error(error.response?.data?.message || error.message || 'Something went wrong.');
  }
};


export const getUserById = async (userId) => {
  try {
    // Assuming the token is stored in localStorage (or you can use any other storage method)
  
    // Make sure you include the Authorization header with the token
    const response = await axios.get(`${apiUrl}/api/user/profile/${userId}`,  {
      withCredentials: true, // Sends cookies or authentication headers
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Log the user data
    console.log('User Data by ID:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    // Handle errors (e.g., display a message to the user)
    return null;
  }
};



// Fetch launch settings for a project
export const getLaunchSettings = async (projectId, token) => {
  try {
    const response = await axios.get(`${apiUrl}/api/auth/launch-settings/${projectId}`, {
      
        withCredentials: true, // Sends cookies or authentication headers
        headers: {
          'Content-Type': 'application/json',
        }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching launch settings:", error);
    throw error;
  }
};

// Update launch settings and delete an event for a project
export const updateLaunchSettings = async (projectId, userId, settings, token) => {
  try {
    const response = await axios.put(`${apiUrl}/api/auth/${projectId}`, {
      settings,
    }, {
      withCredentials: true, // Sends cookies or authentication headers
      headers: {
        'Content-Type': 'application/json',
      }});
    return response.data;
  } catch (error) {
    console.error("Error updating launch settings:", error);
    throw error;
  }
};

// Delete an event from the launch settings for a project
export const deleteEventFromLaunchSettings = async (projectId, event, token) => {
  try {
    const response = await axios.put(`${apiUrl}/api/auth/${projectId}/delete-event`, {
      event,
    }, {
      withCredentials: true, // Sends cookies or authentication headers
      headers: {
        'Content-Type': 'application/json',
      }});
    return response.data;
  } catch (error) {
    console.error("Error deleting event from launch settings:", error);
    throw error;
  }
};



// Create launch settings
export const createLaunchSettings = async (projectId, settings) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/auth/launch-settings`,
      { projectId, settings },
      {
        withCredentials: true, // Sends cookies or authentication headers
        headers: {
          'Content-Type': 'application/json',
        } } // Include token for authentication
    );
    return response.data;
  } catch (error) {
    console.error("Error creating launch settings:", error.response?.data || error.message);
    throw error;
  }
};




// Define a function to fetch activity data by projectId and activityId
export const fetchActivity = async (projectId, activityId) => {
  try {
    const response = await axios.get(`${apiUrl}/api/auth/project/${projectId}/activity/${activityId}`);
    console.log('Activity fetched successfully:', response.data);
    return response.data; // return the activity data from the response
  } catch (error) {
    console.error('Error fetching activity:', error.response ? error.response.data : error.message);
    throw error; // Optionally, rethrow error for further handling
  }
};


export const updateActivity = async (projectId, activityId, activityData) => {
  try {
      const response = await axios.put(`${apiUrl}/api/auth/project/${projectId}/${activityId}/update`, activityData,  {
        withCredentials: true, // Sends cookies or authentication headers
        headers: {
          'Content-Type': 'application/json',
        } } );
      console.log("Activity updated successfully:", response.data);
      return response.data;
  } catch (error) {
      console.error("Error updating activity:", error.response?.data || error.message);
      throw error;
  }
};













