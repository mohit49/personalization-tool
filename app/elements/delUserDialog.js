import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { deleteUsersFromProject } from "@/app/api/api"; // Import the API service

export function DelUserDialog({ open, setOpen, projectId, usersList }) {
  const [users, setUsers] = useState(usersList || []); // Users passed as props
  const [selectedUsers, setSelectedUsers] = useState([]); // Track selected users for deletion
  const [success, setSuccess] = useState(false);

  // Handle checkbox change (select/deselect user)
  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter((id) => id !== userId); // Deselect
      } else {
        return [...prevSelectedUsers, userId]; // Select
      }
    });
  };

  // Handle form submission to remove selected users
  const handleSubmit = async () => {
    const payload = {
      userIds: selectedUsers, // Only send selected users
    };

    try {
      const data = await deleteUsersFromProject(payload, projectId); // Call the API to remove users
      console.log("Users removed successfully:", data);
      setSuccess(true);
    } catch (error) {
      console.error("Error removing users:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!success && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete User(s)</DialogTitle>
            <DialogDescription>
              Select the users you want to remove from the project. They will no longer have access to the project.
            </DialogDescription>
          </DialogHeader>
          {users.length === 0 && <h3>Sorry, No Users To Delete</h3>}

          {/* Container to make the list scrollable when more than 8 users */}
          <div className="max-h-[300px] overflow-y-auto">
            {users.map((user, index) => (
              <div key={index} className="flex items-center justify-between py-1">
                {/* Flex container for email and checkbox */}
                <div className="flex items-center gap-4 w-full">
                  
                  <Input
                    id={`email-${index}`}
                    className="flex-1"
                    value={user.userId}
                    disabled // Email should be read-only
                  />
                </div>

                {/* Checkbox for user selection */}
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    id={`checkbox-${index}`}
                    checked={selectedUsers.includes(user.userId)}
                    onChange={() => handleCheckboxChange(user.userId)}
                  />
                 
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={selectedUsers.length === 0} // Disable if no users are selected
            >
              Delete Selected Users
            </Button>
          </DialogFooter>
        </DialogContent>
      )}

      {success && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
            <DialogDescription>
              The selected user(s) have been removed from the project.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setSuccess(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
