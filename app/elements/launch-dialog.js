import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ClipLoader from "react-spinners/ClipLoader";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MonacoEditor from "@monaco-editor/react";
import { getLaunchSettings, updateLaunchSettings, deleteEventFromLaunchSettings, createLaunchSettings } from "@/app/api/api"; // Importing API calls

export default function LaunchDialog({ open, setOpen, projectId, token }) {
  const [eventSelections, setEventSelections] = useState([
    { event: "", element: "", variable: "", customEvent: "", customCode: "", isMonacoVisible: false },
  ]);
  const [loading, setLoading] = useState(false); // Add loading state
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  // Fetch launch settings on component mount
  useEffect(() => {
    const fetchLaunchSettings = async () => {
      setLoading(true); // Start loading
      try {
        const launchSettingsData = await getLaunchSettings(projectId, token);
        setEventSelections(launchSettingsData.settings || []);
      } catch (error) {
        console.error("Failed to fetch launch settings:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    if (open) {
      fetchLaunchSettings();
    }
  }, [open, projectId, token]);

  const handleEventChange = (index, value) => {
    const updatedSelections = [...eventSelections];
    updatedSelections[index].event = value;
    setEventSelections(updatedSelections);
  };

  const handleInputChange = (index, type, value) => {
    const updatedSelections = [...eventSelections];
    updatedSelections[index][type] = value;
    setEventSelections(updatedSelections);
  };

  const addEventSelection = () => {
    setEventSelections([
      ...eventSelections,
      { event: "", element: "", variable: "", customEvent: "", customCode: "", isMonacoVisible: false },
    ]);
  };

  const removeEventSelection = async (index) => {
    const eventToDelete = eventSelections[index];
    try {
      setLoading(true); // Start loading
      //const response = await deleteEventFromLaunchSettings(projectId, eventToDelete.event, token); // Removed userId
      //alert(response.message); // Removed alert
      const updatedSelections = eventSelections.filter((_, i) => i !== index);
      setEventSelections(updatedSelections);
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const toggleMonacoEditor = (index) => {
    const updatedSelections = [...eventSelections];
    updatedSelections[index].isMonacoVisible = !updatedSelections[index].isMonacoVisible;
    setEventSelections(updatedSelections);
  };

  const saveSettings = async () => {
    setLoading(true); // Start loading
    try {
      const response = await createLaunchSettings(projectId, eventSelections, token); // Removed userId
      setSuccessMessage("Settings saved successfully!"); // Set success message
     // setOpen(false); // Optionally close the dialog after saving
    } catch (error) {
      console.error("Error saving settings:", error);
      setSuccessMessage("Error saving settings."); // Set error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[90%] sm:max-h-[700px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Setup Your Script Engine</DialogTitle>
          <DialogDescription>
            Select the events on which you want to trigger the script to initialize.
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex justify-center items-center absolute inset-0 bg-gray-500 bg-opacity-50 z-10">
            <ClipLoader color="#ffffff" size={50} /> {/* Loader with color and size */}
          </div>
        )}

        {eventSelections.map((selection, index) => (
          <div key={index} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{`Event ${index + 1}`}</h3>
              <Button
                variant="link"
                className="text-red-500 text-[30px]"
                onClick={() => removeEventSelection(index)}
              >
                ×
              </Button>
            </div>

            <Select
              value={selection.event}
              onValueChange={(value) => handleEventChange(index, value)}
            >
              <SelectTrigger className="w-[280px] text-[16px] bg-[#eeeeee]">
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-[16px]">Events</SelectLabel>
                  <SelectItem
                    value="page-loaded"
                    disabled={eventSelections.some(
                      (sel) => sel.event === "page-loaded" && selection.event !== "page-loaded"
                    )}
                  >
                    On Page Loaded
                  </SelectItem>
                  <SelectItem value="element-exist">On Element Exists</SelectItem>
                  <SelectItem value="variable-exists">Variable Exists</SelectItem>
                  <SelectItem value="custom-event">Custom Event</SelectItem>
                  <SelectItem value="custom-code">Custom Code</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {selection.event === "element-exist" && (
              <div>
                <Label htmlFor={`element-${index}`} className="text-[16px] my-[10px] flex">Element Selector</Label>
                <Input
                  id={`element-${index}`}
                  value={selection.element}
                  onChange={(e) => handleInputChange(index, "element", e.target.value)}
                  placeholder="Enter element selector"
                />
              </div>
            )}

            {selection.event === "variable-exists" && (
              <div>
                <Label htmlFor={`variable-${index}`} className="text-[16px] my-[10px] flex">Variable Name</Label>
                <Input
                  id={`variable-${index}`}
                  value={selection.variable}
                  onChange={(e) => handleInputChange(index, "variable", e.target.value)}
                  placeholder="Enter variable name"
                />
              </div>
            )}

            {selection.event === "custom-event" && (
              <div>
                <Label htmlFor={`custom-event-${index}`} className="text-[16px] my-[10px] flex">Custom Event Name</Label>
                <Input
                  id={`custom-event-${index}`}
                  value={selection.customEvent}
                  onChange={(e) => handleInputChange(index, "customEvent", e.target.value)}
                  placeholder="Enter custom event name"
                />
              </div>
            )}

            {selection.event === "custom-code" && (
              <div>
                <Label htmlFor={`custom-code-${index}`} className="text-[16px] my-[10px] flex">Custom JavaScript Code Add trigger() method after your code success</Label>
                
                <Button
                  variant="outline"
                  onClick={() => toggleMonacoEditor(index)}
                  className="my-2 !bg-[#16a085] !text-[#ffffff]"
                >
                  {selection.isMonacoVisible ? "Hide Code Editor" : "Show Code Editor"}
                </Button>
                
                {selection.isMonacoVisible && (
                  <MonacoEditor
                    height="400px"
                    language="javascript"
                    value={selection.customCode}
                    onChange={(value) => handleInputChange(index, "customCode", value)}
                    theme="vs-dark"
                  />
                )}
              </div>
            )}
          </div>
        ))}

        <div className="mt-4">
          <Button onClick={addEventSelection}>Add Event</Button>
        </div>

        {/* Show success or error message */}
        {successMessage && (
          <div className="mt-4 text-green-500 text-[16px]">
            {successMessage}
          </div>
        )}

        {/* Save and Cancel Buttons */}
        <div className="mt-4 flex justify-end space-x-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={saveSettings}>Save Settings</Button>
        </div>

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
