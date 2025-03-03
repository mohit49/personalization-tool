import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitUsers } from "@/app/api/api"; // Import the API service

export function DataDialog({ open, setOpen, projectId }) {
  const [users, setUsers] = useState([{ userId: "", role: "" }]);
  const [sucess, setSucess] = useState(false);
  // Add a new user
  const handleAddUser = () => {
    setUsers([...users, { userId: "", role: "" }]);
  };

  // Update user input
  const handleChange = (index, field, value) => {
    const updatedUsers = [...users];
    updatedUsers[index][field] = value;
    setUsers(updatedUsers);
  };

  // Remove a user
  const handleRemoveUser = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
  };

  // Handle form submission and send data to API
  const handleSubmit = async () => {
    // Format the users data as required by the API
    const payload = {
      users: users.map((user) => ({
        userId: user.userId,
        role: user.role,
      })),
    };

    try {
      const data = await submitUsers(payload, projectId); // Call the API service with formatted data
      console.log("Data submitted successfully:", data);
      setSucess(true)
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
     {!sucess && <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        {users.map((user, index) => (
          <div key={index} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={`email-${index}`} className="text-left">
                Email
              </Label>
              <Input
                id={`email-${index}`}
                className="col-span-3"
                value={user.userId}
                onChange={(e) => handleChange(index, "userId", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={`role-${index}`} className="text-left">
                Role
              </Label>
              <Select
                value={user.role}
                onValueChange={(value) => handleChange(index, "role", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Developer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="observer">Observer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="approver">Approver</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Remove User Button */}
            <div className="w-full text-right">
            <Button className="w-[150px] self-end" onClick={() => handleRemoveUser(index)} variant="outline">
              Remove User
            </Button>
            </div>
          </div>
        ))}

        <Button onClick={handleAddUser}>Add More User</Button>

        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent> }
      {sucess && <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Success</DialogTitle>
          <DialogDescription>
            User added successfully
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={()=>setSucess(false)}>
            Close
          </Button>
        </DialogFooter></DialogContent>}
      
    </Dialog>
  );
}
