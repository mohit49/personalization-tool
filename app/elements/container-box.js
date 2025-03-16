
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
import { fetchActivity , updateActivity, deleteCodeItem , fetchProjectById} from '@/app/api/api';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";

export function ContainerBox({ open, setOpen, eleData , activityId, projectId, setActivityData, loadWebsiteUrl }) {
    const [containerClass, setContainerClass] = useState("");
    const [containerId, setContainerId] = useState("");
    const [maxWidth, setMaxWidth] = useState("");
    const [maxHeight, setMaxHeight] = useState("");
    const [minHeight, setMinHeight] = useState("");
    const [minWidth, setMinWidth] = useState("");
    const[backGroundColor, setBackgroundColor] = useState();
    const [margin, setMargin] = useState({
        mt:"",
        ml:"",
         mb:"",
         mr:"",
    });
    const [padding, setPadding] = useState({
        pt:"",
        pl:"",
         pb:"",
         pr:"",
    });
    function generateDateTime4DigitCode() {
        const now = new Date();
    
        // Extract milliseconds and format it to 4 digits
        const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
    
        // Combine with seconds or minutes for better uniqueness
        const seconds = now.getSeconds().toString().padStart(2, '0');
    
        // Generate a 4-digit code using milliseconds + seconds
        const code = (milliseconds + seconds).slice(-4);
    
        return code;
    }
const addContiner = (()=>{
if(containerClass) {
    const createdEle = document.createElement("div");
    createdEle.className += containerClass;
   
        createdEle.id = "personalized-element-" + generateDateTime4DigitCode();;
    if(maxWidth)
        createdEle.style.maxWidth = maxWidth;
    if(minHeight)
        createdEle.style.minHeight = minHeight;

    if(minWidth)
        createdEle.style.minWidth = minWidth;
    if(maxHeight)
        createdEle.style.maxHeight = maxHeight;
    if(backGroundColor) 
        createdEle.style.background = backGroundColor;

    createdEle.style.margin = `${margin.mt || 0} ${margin.mr || 0} ${margin.mb || 0} ${margin.ml || 0}`;

    createdEle.style.padding = `${padding.pt || 0} ${padding.pr || 0} ${padding.pb || 0} ${padding.pl || 0}`;

    eleData.iframeDoc.current.contentDocument.body.querySelector("#"+eleData.eleMent).appendChild(createdEle);
     updateActivity(projectId, activityId, 
              {"htmlCode": [
                {
                  "type" : "container-added",
                  "selector":  "#"+eleData.eleMent,
                  "newText": createdEle.outerHTML
                }
            ],
              
            
            }
            )
          .then((data) => {
              console.log("Update successful!", data);
            
              setActivityData(data.activity);
              loadWebsiteUrl();
          })
          .catch((error) => {
              console.error("Update failed", error);
          });
}
})
  return (

<AlertDialogContent>
<AlertDialogHeader>
  <AlertDialogTitle>Setup Your Container</AlertDialogTitle>
  <AlertDialogDescription>
  You can set up your container using the fields below, add a custom class, or apply existing classes from the website to maintain a consistent look.
  </AlertDialogDescription>
</AlertDialogHeader>
 <div className="flex-row flex-wrap gap-[10px] flex">
            <Input
              placeholder="Container Classes"
              className="w-[45%] h-[40px]"
              value={containerClass}
              onChange={(e) => setContainerClass(e.target.value)}
            />
     
     <Input
              placeholder="Max Width"
              className="w-[45%] h-[40px]"
              value={maxWidth}
              onChange={(e) => setMaxWidth(e.target.value)}
            />

<Input
              placeholder="Max Height"
            className="w-[45%] h-[40px]"
              value={maxHeight}
              onChange={(e) => setMaxHeight(e.target.value)}
            />
              <Input
              placeholder="Min Width"
           className="w-[45%] h-[40px]"
              value={minWidth}
              onChange={(e) => setMinWidth(e.target.value)}
            />
    
    <Input
              placeholder="Min Height"
             className="w-[45%] h-[40px]"
              value={minHeight}
              onChange={(e) => setMinHeight(e.target.value)}
            />


<Input
              placeholder="Bg colour"
             className="w-[45%] h-[40px]"
              value={backGroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
            />



           
          </div>
          <div className="margin-div flex flex-wrap flex-row gap-[10px]">
          <Input
              placeholder="margin-top"
             className="w-[20%] h-[40px]"
              value={margin.mt}
              onChange={(e) => setMargin({ ...margin, mt: e.target.value })}
            />
              <Input
              placeholder="margin-right"
             className="w-[20%] h-[40px]"
              value={margin.mr}
              onChange={(e) => setMargin({ ...margin, mr: e.target.value })}
            />
              <Input
             placeholder="margin-bottom"
             className="w-[20%] h-[40px]"
              value={margin.mb}
              onChange={(e) => setMargin({ ...margin, mb: e.target.value })}
            />
              <Input
            placeholder="margin-left"
             className="w-[20%] h-[40px]"
              value={margin.ml}
              onChange={(e) => setMargin({ ...margin, ml: e.target.value })}
            />
          </div>
          <div className="margin-div flex flex-wrap flex-row gap-[10px]">
          <Input
              placeholder="padding-top"
             className="w-[20%] h-[40px]"
              value={padding.pt}
              onChange={(e) => setPadding({ ...padding, pt: e.target.value })}
            />
              <Input
              placeholder="padding-right"
             className="w-[20%] h-[40px]"
             value={padding.pr}
              onChange={(e) => setPadding({ ...padding, pr: e.target.value })}
            />
              <Input
             placeholder="padding-bottom"
             className="w-[20%] h-[40px]"
             value={padding.pb}
              onChange={(e) => setPadding({ ...padding, pb: e.target.value })}
            />
              <Input
            placeholder="padding-left"
             className="w-[20%] h-[40px]"
             value={padding.pl}
              onChange={(e) => setPadding({ ...padding, pl: e.target.value })}
            />
          </div>
<AlertDialogFooter>
  <AlertDialogCancel>Cancel</AlertDialogCancel>
  <AlertDialogAction onClick={addContiner} >Continue</AlertDialogAction>
</AlertDialogFooter>
</AlertDialogContent>
  );
}

