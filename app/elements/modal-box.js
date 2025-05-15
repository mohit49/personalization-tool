"use client";
import { useState, useRef, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import MonacoEditor from "@monaco-editor/react";
import { SketchPicker } from "react-color";
import { updateActivity, fetchModal, updateModal } from "@/app/api/api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { Radio } from "lucide-react";

export function ModalBox({
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
  const [containerClass, setContainerClass] = useState("");
  const [maxWidth, setMaxWidth] = useState("");
  const [maxHeight, setMaxHeight] = useState("");
  const [minHeight, setMinHeight] = useState("");
  const [minWidth, setMinWidth] = useState("");
  const [buttonName, setButtonName] = useState("");
  const [showCustomCodeCss, setShowCustomCodeCss] = useState(false);
  const [customCodeCss, setCustomCodeCss] = useState("");
  const [customCodeHtml, setCustomCodeHtml] = useState("");
  const [showCustomCodeHtml, setShowCustomCodeHtml] = useState(false);
  const [backGroundColor, setBackgroundColor] = useState(
    "rgba(255, 255, 255, 1)"
  );
  const [position, setPosition] = useState("center");
  const [overlayBg, setOverlayBg] = useState("rgba(0, 0, 0, 0.5)");

  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showOverlayPicker, setShowOverlayPicker] = useState(false);
  const [showButtonOptions, setShowButtonOptions] = useState(false);
  const [buttonId, setButtonId] = useState("");
  const [buttonColor, setButtonColor] = useState("#ffffff");
  const [buttonTextColour, setButtonTextColour] = useState("#000000");
  const [ButrtonSize, setButtonSize] = useState("md");
  const [showCustomCode, setShowCustomCode] = useState(false);
  const [customCode, setCustomCode] = useState("");

  const [initializeOnLoad, setInitializeOnLoad] = useState(false);
  const [delayMs, setDelayMs] = useState("");
  const [inputOnElementExist, setInputOnElementExist] = useState("");
  const [responsive, setResponsive] = useState(false);
  const [backDrop, setBackDrop] = useState(false);
  const bgPickerRef = useRef(null);
  const overlayPickerRef = useRef(null);
  const [animate, setAnimate] = useState(false);
  const [continueObserve, setContinueObserve] = useState(false);
  const [exitIntent, setExitIntent] = useState(false);
  const [inactiveDelay, setInactiveDelay] = useState();
  const [cookiesHours, setCookiesHours] = useState();
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
                position,
                responsive,
                backDrop,
                animate,
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
          setResponsive(data?.activity?.settings?.responsive);
          setInitializeOnLoad(data?.activity?.settings?.initializeOnLoad);
          setInputOnElementExist(data?.activity?.settings?.inputOnElementExist);
          setMaxHeight(data?.activity?.settings?.maxHeight);
          setMaxWidth(data?.activity?.settings?.maxWidth);
          setMinHeight(data?.activity?.settings?.minHeight);
          setMinWidth(data?.activity?.settings?.minWidth);
          setOverlayBg(data?.activity?.settings?.overlayBg);
          setShowButtonOptions(data?.activity?.settings?.showButtonOptions);
          setShowCustomCode(data?.activity?.settings?.showCustomCode);
          setPosition(data?.activity?.settings?.position);
          setBackDrop(data?.activity?.settings?.backDrop);
          setAnimate(data?.activity?.settings?.animate);
          setButtonColor(data?.activity?.settings?.buttonColor);
          setButtonTextColour(data?.activity?.settings?.buttonTextColour);
          setButtonSize(data?.activity?.settings?.ButrtonSize);
          setContinueObserve(data?.activity?.settings?.continueObserve);
          setShowCustomCodeCss(data?.activity?.settings?.showCustomCodeCss);
          setShowCustomCodeHtml(data?.activity?.settings?.showCustomCodeHtml);
          setCustomCodeHtml(data?.activity?.settings?.customCodeHtml);
          setCustomCodeCss(data?.activity?.settings?.customCodeCss);
          setExitIntent(data?.activity?.settings?.exitIntent);
          setCookiesHoursI(data?.activity?.settings?.cookiesHours);
          setInactiveDelay(data?.activity?.settings?.inactiveDelay);
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
      setResponsive(false);
      setInitializeOnLoad(false);
      setPosition("center");
      setInputOnElementExist("");
      setMaxHeight("");
      setMaxWidth("");
      setMinHeight("");
      setMinWidth("");
      setOverlayBg("");
      setShowButtonOptions(false);
      setShowCustomCode(false);
      setPosition("center");
      setBackDrop(false);
      setAnimate(false);
      setButtonColor("#ffffff");
      setButtonTextColour("#000000");
      setButtonSize("md");
      setContinueObserve(false);
      setShowCustomCodeCss(false);
      setShowCustomCodeHtml(false);
      setExitIntent(false);
    }
  }, [open]);

  return (
    <AlertDialogContent className="w-[80vw] max-w-[900px] mx-auto p-6">
      <AlertDialogHeader>
        <AlertDialogTitle>Setup Modal Box</AlertDialogTitle>
        <AlertDialogDescription>
          Configure your modal box with custom styles, buttons, and optional
          also add "dark-close" , "light-close" to change icon colour custom
          code.
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
        <div className="flex gap-[15px]">
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
          <div className="flex items-center gap-2">
            <Checkbox
              id="exitIntent"
              checked={exitIntent}
              onCheckedChange={setExitIntent}
            />
            <label htmlFor="exitIntent" className="text-sm font-medium">
              Enable On Exit Intent
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="animateIfNotCenter"
              checked={animate}
              onCheckedChange={setAnimate}
            />
            <label htmlFor="animateIfNotCenter" className="text-sm font-medium">
              Animate Popup if not center
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="responsive"
              checked={responsive}
              onCheckedChange={setResponsive}
            />
            <label htmlFor="responsive" className="text-sm font-medium">
              Mobile Responsive
            </label>
          </div>
        </div>

        {initializeOnLoad && (
          <Input
            placeholder="Delay in Milliseconds"
            type="number"
            value={delayMs}
            onChange={(e) => setDelayMs(e.target.value)}
          />
        )}
        {exitIntent && (
          <div className="flex items-center gap-2">
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      placeholder="24"
                      type="number"
                      value={cookiesHours}
                      onChange={(e) => setCookiesHours(e.target.value)}
                    />
                  </TooltipTrigger>
                  <TooltipContent className={"w-[250px]"}>
                    <p>This Will Set cookies hours, if user has seen this popup, then poup will shown again after 24 hours only  </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      placeholder="13"
                      type="number"
                      value={inactiveDelay}
                      onChange={(e) => setInactiveDelay(e.target.value)}
                    />
                  </TooltipTrigger>
                  <TooltipContent className={"w-[250px]"}>
                    <p>This will trigger popup is user is inactive for below given time, 
                      So if you want to show poup up after 30 seconds until user is inactive to the website , 
                      If its blank then inactive functionality will not work</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}

        <p>
          <b>Pop Up Position</b>
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="bottom-left"
              name="position"
              value="bottom-left"
              checked={position === "bottom-left"}
              onChange={(e) => setPosition(e.target.value)}
            />
            <label htmlFor="bottom-left" className="text-sm font-medium">
              Bottom Left
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="bottom-right"
              name="position"
              value="bottom-right"
              checked={position === "bottom-right"}
              onChange={(e) => setPosition(e.target.value)}
            />
            <label htmlFor="bottom-right" className="text-sm font-medium">
              Bottom Right
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="top-left"
              name="position"
              value="top-left"
              checked={position === "top-left"}
              onChange={(e) => setPosition(e.target.value)}
            />
            <label htmlFor="top-left" className="text-sm font-medium">
              Top Left
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="top-right"
              name="position"
              value="top-right"
              checked={position === "top-right"}
              onChange={(e) => setPosition(e.target.value)}
            />
            <label htmlFor="top-right" className="text-sm font-medium">
              Top Right
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="center"
              name="position"
              value="center"
              checked={position === "center"}
              onChange={(e) => setPosition(e.target.value)}
            />
            <label htmlFor="center" className="text-sm font-medium">
              Center
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="backDrop"
            checked={backDrop}
            onCheckedChange={setBackDrop}
          />
          <label htmlFor="backDrop" className="text-sm font-medium">
            Enable Back Drop
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Input
            className="w-[300px]"
            placeholder="show on Element Exist"
            value={inputOnElementExist}
            onChange={(e) => setInputOnElementExist(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <Checkbox
              id="continueObserve"
              checked={continueObserve}
              onCheckedChange={setContinueObserve}
            />
            <label htmlFor="continueObserve" className="text-sm font-medium">
              Continue Observe class/id
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="showCustomCode"
            checked={showCustomCode}
            onCheckedChange={setShowCustomCode}
          />
          <label htmlFor="showCustomCode" className="text-sm font-medium">
            Add Custom Code JS
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
        <div className="flex items-center gap-2">
          <Checkbox
            id="showCustomCode"
            checked={showCustomCodeCss}
            onCheckedChange={setShowCustomCodeCss}
          />
          <label htmlFor="showCustomCode" className="text-sm font-medium">
            Add Custom Code CSS
          </label>
        </div>
        {showCustomCodeCss && (
          <MonacoEditor
            height="300px"
            theme="vs-dark"
            defaultLanguage="css"
            value={customCodeCss}
            onChange={setCustomCodeCss}
          />
        )}
        <div className="flex items-center gap-2">
          <Checkbox
            id="showCustomCode"
            checked={showCustomCodeHtml}
            onCheckedChange={setShowCustomCodeHtml}
          />
          <label htmlFor="showCustomCode" className="text-sm font-medium">
            Add Custom Code HTML
          </label>
        </div>
        {showCustomCodeHtml && (
          <MonacoEditor
            height="300px"
            theme="vs-dark"
            defaultLanguage="html"
            value={customCodeHtml}
            onChange={setCustomCodeHtml}
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
