
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Quill from 'quill';
import Link from 'quill/formats/link';
import "quill/dist/quill.core.css";

import { Delta } from 'quill';
import { fetchActivity , updateActivity, deleteCodeItem , fetchProjectById} from '@/app/api/api';
import { AlertDialog, AlertDialogAction, AlertDialogOverlay, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Editor, EditorState } from 'draft-js';
import RichTextEditor from "./RichTextEditor";

export function TextBox({ open, setOpen, eleData , activityId, projectId, setActivityData, loadWebsiteUrl }) {
  const [range, setRange] = useState();
  const [lastChange, setLastChange] = useState();
  const [readOnly, setReadOnly] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const quillRef = useRef()
    const[backGroundColor, setBackgroundColor] = useState();
    const [rawContent , setRawContent] = useState();
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
console.log(rawContent)
    const createdEle = document.createElement("div");
    createdEle.innerHTML = rawContent;
   
       
   
     updateActivity(projectId, activityId, 
              {"htmlCode": [
                {
                  "type" : "text-editor",
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

})

const onChange = (state) => {
  setEditorState(state);
};
  return (
    <>
<AlertDialogOverlay className="!z-[1] bg-black/50 fixed inset-0" />

<AlertDialogContent className="sm:max-w-[700px] z-[2]">
<AlertDialogHeader>
  <AlertDialogTitle>Add Text In Your Container</AlertDialogTitle>
  <AlertDialogDescription>
 Use Below option to make text bold italic change text colour
  </AlertDialogDescription>
</AlertDialogHeader>
<RichTextEditor  />
<AlertDialogFooter>
  <AlertDialogCancel>Cancel</AlertDialogCancel>
  <AlertDialogAction onClick={addContiner} >Continue</AlertDialogAction>
</AlertDialogFooter>
</AlertDialogContent>
</>
  );
}

