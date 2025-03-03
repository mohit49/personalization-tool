import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createActivity } from "@/app/api/api"; // Import the API function

export function CreateActivityDialog({ open, setOpen, projectId, activityType }) {
  const [success, setSuccess] = useState(false);
  const [availability, setAvailability] = useState(""); // Track the selected availability option
  const [activityName, setActivityName] = useState("");
  const [activityUrl, setActivityUrl] = useState("");
  const [location, setLocation] = useState(""); // Location for "local" activity

  // Handle select change for availability
  const handleSelectChange = (value) => {
    setAvailability(value); // Update the availability state
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Prepare the data to send to the backend
    const payload = {
      activityName,
      availability,
      activityType,
      activityUrl,
      location: availability === "local" ? location : undefined,
      email: "user@example.com", // Replace with dynamic user email if needed
      activityStatus: "drafted", // Default activity status (can be updated to "live" as needed)
    };

    try {
      // Call the createActivity API function
      const result = await createActivity(projectId, payload);

      // Handle success
      setSuccess(true);
    } catch (error) {
      // Handle error
      console.error("Error creating activity:", error.message);
      alert(error.message); // Simple alert for error handling
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!success && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Activity</DialogTitle>
            <DialogDescription>
              Selecting Global will render Activity with all other activities, if you want to run the activity separately, use local.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-col gap-[10px] flex">
            <Input
              placeholder="Activity Name"
              className="col-span-3 h-[40px]"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
            />
            <Select className="h-[40px]" onValueChange={handleSelectChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="local">Local</SelectItem>
              </SelectContent>
            </Select>

            {availability === "local" && ( // Only show Activity Location if "local" is selected
              <Input
                placeholder="Provide Activity Location Name"
                className="col-span-3 h-[40px]"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            )}

            <Input
              placeholder="Activity URL"
              className="col-span-3 h-[40px]"
              value={activityUrl}
              onChange={(e) => setActivityUrl(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" onClick={handleSubmit}>
              Create Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      )}

      {success && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
            <DialogDescription>
              The activity has been successfully created.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => {setSuccess(false) ;setOpen(false)} }>Close</Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
