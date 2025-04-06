"use client";
import { useState, useRef, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import MonacoEditor from "@monaco-editor/react";
import { SketchPicker } from "react-color";
import { updateActivity, fetchModal , updateModal } from "@/app/api/api";

import { AppContext } from "@/app/context/provider"; // Import AppContext
import {
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export function ModalBox({
  open,
  setOpen,
  eleData,
  activityId,
  projectId,

  loadWebsiteUrl,
  modalId
}) {
      const { modalEdited, setModalEdited, activity, setActivityData  } = useContext(AppContext);
  const [containerClass, setContainerClass] = useState("");
  const [maxWidth, setMaxWidth] = useState("");
  const [maxHeight, setMaxHeight] = useState("");
  const [minHeight, setMinHeight] = useState("");
  const [minWidth, setMinWidth] = useState("");
  const [buttonName, setButtonName] = useState("");
  const [backGroundColor, setBackgroundColor] = useState(
    "rgba(255, 255, 255, 1)"
  );
  const [overlayBg, setOverlayBg] = useState("rgba(0, 0, 0, 0.5)");

  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showOverlayPicker, setShowOverlayPicker] = useState(false);
  const [showButtonOptions, setShowButtonOptions] = useState(false);
  const [buttonId, setButtonId] = useState("");
  const [showCustomCode, setShowCustomCode] = useState(false);
  const [customCode, setCustomCode] = useState("");

  const [initializeOnLoad, setInitializeOnLoad] = useState(false);
  const [delayMs, setDelayMs] = useState("");
  const [inputOnElementExist, setInputOnElementExist] = useState("");

  const bgPickerRef = useRef(null);
  const overlayPickerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (bgPickerRef.current && !bgPickerRef.current.contains(event.target)) {
        setShowBgPicker(false);
      }
      if (
        overlayPickerRef.current &&
        !overlayPickerRef.current.contains(event.target)
      ) {
        setShowOverlayPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  useEffect(() => {
    if (modalId.length > 0) {
      fetchModal(projectId, activityId, modalId)
        .then((data) => {
          setContainerClass(data?.activity?.settings?.containerClass);
          setButtonId(data?.activity?.settings?.buttonId),
            setButtonName(data?.activity?.settings?.buttonName);
          setBackgroundColor(data?.activity?.settings?.backGroundColor);
          setCustomCode(data?.activity?.settings?.customCode);
          setDelayMs(data?.activity?.settings?.delayMs);
          setInitializeOnLoad(data?.activity?.settings?.initializeOnLoad);
          setInputOnElementExist(data?.activity?.settings?.inputOnElementExist);
          setMaxHeight(data?.activity?.settings?.maxHeight);
          setMaxWidth(data?.activity?.settings?.maxWidth);
          setMinHeight(data?.activity?.settings?.minHeight);
          setMinWidth(data?.activity?.settings?.minWidth);
          setOverlayBg(data?.activity?.settings?.overlayBg);
          setShowButtonOptions(data?.activity?.settings?.showButtonOptions);
          setShowCustomCode(data?.activity?.settings?.showCustomCode);
        })
        .catch((error) => {
          console.error("Failed to fetch activity:", error);
        });
    } else {
      setContainerClass("");
      setButtonId(""), setButtonName("");
      setBackgroundColor("");
      setCustomCode("");
      setDelayMs("");
      setInitializeOnLoad(false);
      setInputOnElementExist("");
      setMaxHeight("");
      setMaxWidth("");
      setMinHeight("");
      setMinWidth("");
      setOverlayBg("");
      setShowButtonOptions(false);
      setShowCustomCode(false);
    }
  }, [open]);

  return (
    <AlertDialogContent className="w-[80vw] max-w-[900px] mx-auto p-6">
      <AlertDialogHeader>
        <AlertDialogTitle>Setup Modal Box</AlertDialogTitle>
        <AlertDialogDescription>
          Configure your modal box with custom styles, buttons, and optional
          custom code.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div className="space-y-6 max-h-[70vh] overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Modal Box Classes"
            value={containerClass}
            onChange={(e) => setContainerClass(e.target.value)}
          />
          <Input
            placeholder="Max Width"
            value={maxWidth}
            onChange={(e) => setMaxWidth(e.target.value)}
          />
          <Input
            placeholder="Max Height"
            value={maxHeight}
            onChange={(e) => setMaxHeight(e.target.value)}
          />
          <Input
            placeholder="Min Width"
            value={minWidth}
            onChange={(e) => setMinWidth(e.target.value)}
          />
          <Input
            placeholder="Min Height"
            value={minHeight}
            onChange={(e) => setMinHeight(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <label className="text-sm font-medium">Background Color</label>
            <div className="flex items-center gap-2 mt-2">
              <div
                className="w-10 h-10 rounded border cursor-pointer"
                style={{ backgroundColor: backGroundColor }}
                onClick={() => setShowBgPicker(!showBgPicker)}
              />
              {showBgPicker && (
                <div className="absolute z-10" ref={bgPickerRef}>
                  <SketchPicker
                    color={backGroundColor}
                    onChange={(color) =>
                      setBackgroundColor(
                        `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`
                      )
                    }
                  />
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <label className="text-sm font-medium">
              Overlay Background Color
            </label>
            <div className="flex items-center gap-2 mt-2">
              <div
                className="w-10 h-10 rounded border cursor-pointer"
                style={{ backgroundColor: overlayBg }}
                onClick={() => setShowOverlayPicker(!showOverlayPicker)}
              />
              {showOverlayPicker && (
                <div className="absolute z-10" ref={overlayPickerRef}>
                  <SketchPicker
                    color={overlayBg}
                    onChange={(color) =>
                      setOverlayBg(
                        `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`
                      )
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="initializeOnLoad"
            checked={initializeOnLoad}
            onCheckedChange={setInitializeOnLoad}
          />
          <label htmlFor="initializeOnLoad" className="text-sm font-medium">
            Initialize on Page Load
          </label>
        </div>
        {initializeOnLoad && (
          <Input
            placeholder="Delay in Milliseconds"
            type="number"
            value={delayMs}
            onChange={(e) => setDelayMs(e.target.value)}
          />
        )}

        <div className="flex items-center gap-2">
          <Checkbox
            id="showButtonOptions"
            checked={showButtonOptions}
            onCheckedChange={setShowButtonOptions}
          />
          <label htmlFor="showButtonOptions" className="text-sm font-medium">
            Show Button Options
          </label>
        </div>
        {showButtonOptions && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Button ID"
              value={buttonId}
              onChange={(e) => setButtonId(e.target.value)}
            />
            <Input
              placeholder="Button Name"
              value={buttonName}
              onChange={(e) => setButtonName(e.target.value)}
            />
          </div>
        )}

        <Input
          placeholder="show on Element Exist"
          value={inputOnElementExist}
          onChange={(e) => setInputOnElementExist(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <Checkbox
            id="showCustomCode"
            checked={showCustomCode}
            onCheckedChange={setShowCustomCode}
          />
          <label htmlFor="showCustomCode" className="text-sm font-medium">
            Add Custom Code
          </label>
        </div>
        {showCustomCode && (
          <MonacoEditor
            height="300px"
            theme="vs-dark"
            defaultLanguage="javascript"
            value={customCode}
            onChange={setCustomCode}
          />
        )}
      </div>

      <AlertDialogFooter className="flex justify-end gap-4 mt-6">
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={updateModalBox}>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
