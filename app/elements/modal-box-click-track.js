"use client";

import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateActivity, fetchModal, updateModal } from "@/app/api/api";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { AppContext } from "@/app/context/provider";

export function ModalBoxClickTrack({
  open,
  setOpen,
  eleData,
  activityId,
  projectId,
  loadWebsiteUrl,
  modalId,
}) {
  const { modalEdited, setModalEdited, activity, setActivityData } =
    useContext(AppContext);

  const [entries, setEntries] = useState([
    { event: "", selector: "", name: "" },
  ]);

  const handleEntryChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const addNewEntry = () => {
    setEntries([...entries, { event: "", selector: "", name: "" }]);
  };

  const removeEntry = (index) => {
    if (entries.length > 1) {
      const updated = [...entries];
      updated.splice(index, 1);
      setEntries(updated);
    }
  };

  const updateModalBox = async () => {
    if (modalEdited) {
      try {
        const response = await updateModal(projectId, activityId, modalId, {
          htmlCode: [
            {
              type: "modal-added",
              selector: "body",
              newText: "data popup",
              settings: {
                containerClass,
                maxWidth,
                maxHeight,
                minWidth,
                minHeight,
                backGroundColor,
                overlayBg,
                showButtonOptions,
                buttonId,
                buttonName,
                showCustomCode,
                customCode,
                initializeOnLoad,
                delayMs,
                inputOnElementExist,
                responsive,
                position,
                backDrop,
                animate,
                buttonColor,
                buttonTextColour,
                ButrtonSize,
                continueObserve,
                showCustomCodeCss,
                showCustomCodeHtml,
                customCodeHtml,
                customCodeCss,
                exitIntent,
                inactiveDelay,
                cookiesHours,
              },
            },
          ],
        });

        return response.data;
      } catch (error) {
        console.error("Error updating modal box:", error);
        throw error;
      }
    } else {
      try {
        const response = await updateActivity(projectId, activityId, {
          htmlCode: [
            {
              type: "tracking-added",
              selector: "body",
              newText: "data tracking",
              settings: {
                entries
              },
            },
          ],
        });

        return response.data;
      } catch (error) {
        console.error("Error updating modal box:", error);
        throw error;
      }
    }
  };

  return (
    <AlertDialogContent className="w-[80vw] max-w-[900px] mx-auto p-6 space-y-6">
      <AlertDialogHeader>
        <AlertDialogTitle>Setup Click Metric on the Activity</AlertDialogTitle>
        <AlertDialogDescription>
          Add the ID or class of the container where you want to track the click
          or scroll metrics. Also specify a unique event name.
        </AlertDialogDescription>
      </AlertDialogHeader>

      {entries.map((entry, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row gap-4 items-center border p-3 rounded-md"
        >
          <Select
            value={entry.event}
            onValueChange={(val) => handleEntryChange(index, "event", val)}
          >
            <SelectTrigger className="w-full md:w-1/4">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="click">Click</SelectItem>
              <SelectItem value="scroll">Scroll</SelectItem>
              <SelectItem value="half-body-scroll">
                Half Body Scroll
              </SelectItem>
            </SelectContent>
          </Select>

          {entry.event === "click" && (
            <Input
              className="w-full md:w-1/4"
              placeholder="Enter ID or class (e.g. #btn or .box)"
              value={entry.selector}
              onChange={(e) =>
                handleEntryChange(index, "selector", e.target.value)
              }
            />
          )}

          <Input
            className="w-full md:w-1/4"
            placeholder="Enter custom event name"
            value={entry.name}
            onChange={(e) =>
              handleEntryChange(index, "name", e.target.value)
            }
          />

          {entries.length > 1 && (
            <Button
              variant="destructive"
              className="mt-2 md:mt-0"
              onClick={() => removeEntry(index)}
            >
              Remove
            </Button>
          )}
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={addNewEntry}>
          + Add More
        </Button>
      </div>

      <AlertDialogFooter className="flex justify-end gap-4 mt-6">
        <AlertDialogCancel onClick={() => setOpen(false)}>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction onClick={updateModalBox}>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
