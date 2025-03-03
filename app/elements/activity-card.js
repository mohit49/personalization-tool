"use client";
import { useEffect, useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { getUserById } from "@/app/api/api";
import { Checkbox } from "@/components/ui/checkbox";
import {
  EllipsisVertical
} from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader"; // Importing the spinner loader
import Link from "next/link";
export default function ActivityCard({ activity , projectId }) {
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [username, setUsername] = useState(null); // State to store the username
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  function trimActivityName(activityName, maxLength = 10) {
    // Check if the activity name is longer than the max length
    if (activityName.length > maxLength) {
      return activityName.substring(0, maxLength) + '...'; // Trim and add "..."
    }
    return activityName; // Return the name as is if it's not too long
  }

  const getUsername = async (id) => {
    try {
      setLoading(true); // Start loading when fetching username
      const data = await getUserById(id);

      // Check if data is available and contains the username
      if (data && data.username) {
        setUsername(data.name); // Set the username in state
        setErrorMessage(""); // Clear any previous error messages
      } else {
        setErrorMessage('Username not found in data'); // Set error message if data is invalid
      }
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      setErrorMessage('Error fetching user details'); // Set error message if there's an issue with the API call
    } finally {
      setLoading(false); // Stop loading when data is fetched or error occurs
    }
  };

  // Fetch the username on mount
  useEffect(() => {
    const fetchUsername = async () => {
      await getUsername(activity.createdBy); // Fetch username for the current activity's creator
    };

    fetchUsername();
  }, [activity.createdBy]); // Re-run when activity.createdBy changes

  return (
    <div
      key={activity._id}
      className={`grid grid-cols-6 gap-4 ${activity.activityType == "xt" ? "bg-[#dfe4ea]" : "bg-[#ced6e0]"} p-3 mb-2 rounded-lg items-center ${activity.activityStatus == "live" ? "outline-green-500 outline outline-offset-2" : "" }`}
    >
      <div className="flex items-center text-[14px] space-x-2 col-span-2 gap-[10px] items-center">
        <Checkbox id={`activity-${activity._id}`} />
        <span className="text-md text-white uppercase text-center bg-[#333333] rounded-lg px-[10px] py-[5px]">
          {activity.activityType}
        </span>

        <span
          className="text-[18px] text-gray-600 capitalize font-bold"
          title={activity.activityName}
        >
          {trimActivityName(activity.activityName, 25)}
        </span>
      </div>

      <div className="col-span-1">
        {/* Render username when it's available */}
        <span className="text-md text-gray-600 capitalize">
          {loading ? <ClipLoader size={20} color="#333" /> : (username || "Loading...")}
        </span>
        {errorMessage && (
          <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
        )}
      </div>

      <div className="w-[100px]">
        <span className="text-md text-gray-600 capitalize flex flex-row items-center gap-3 justify-between">
          {activity.activityStatus || "Not Specified"} <span className={`w-[10px] h-[10px] rounded-[50px] ${activity.activityStatus == "live" ? "bg-green-600" : activity.activityStatus == "stopped" ? "bg-red-500 " :"bg-gray-500"}`}></span>
        </span>
      </div>

      <div className="col-span-2 flex flex-row justify-between items-center">
        <div className="text-md text-gray-600">
          {new Date(activity.updatedAt).toLocaleString()}
        </div>
        <Link className="px-2 py-1 bg-brand-dafault rounded text-[#ffffff]" href={`/dashboard/${projectId}/activity/${activity._id}`}
         
        >
          Edit Activity
        </Link>
        <EllipsisVertical />
      </div>

      {/* Show success message if available */}
      {successMessage && (
        <div className="text-green-500 text-sm mt-2">{successMessage}</div>
      )}
    </div>
  );
}
