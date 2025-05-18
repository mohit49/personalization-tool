import { useEffect, useState , useContext } from "react";
import { Activity , Images ,ChevronRight, Heading, Type, Book, MessageSquare, MousePointer} from "lucide-react"

  export function DragBar({setActivityBar, activityBar , AddModelBox, AddModelBoxClickTrack  }) {
    const [draggedElement, setDraggedElement] = useState(null);
    const handleDragStart = (event, id) => {
        
        event.dataTransfer.setData("text/plain", id);
      };
    return (
     <>
     <div className="fixed bottom-0 w-full px-[20px] py-[20px] bg-[#000000] flex flex-row gap-[20px]">

<ul className="flex flex-row gap-[20px]">
<li className="text-[#ffffff] flex flex-row item-center gap-[10px] pointer" onClick={(e)=>setActivityBar(!activityBar)}><Activity /> Activity Status</li>

<li className="text-[#ffffff] flex flex-row item-center gap-[10px] pointer">|</li>
</ul>
<span className="text-[#ffffff] flex flex-row">Dragable Elements  <ChevronRight  /></span>
<ul  className="flex flex-row gap-[20px]"><li className="text-[#ffffff] flex flex-row item-center gap-[10px] pointer" onClick={(e)=>setActivityBar(!activityBar)}> 
      {/* Draggable Element */}
      <div
        id="add-Slider"
        draggable="true"
        onDragStart={(event) => handleDragStart(event, "draggable-slider")}
        style={{
        
       
          textAlign: "center",
          lineHeight: "50px",
          cursor: "grab",
          userSelect: "none",
        }}
      ><Images /> </div>Slider</li>
<li className="text-[#ffffff] flex flex-row item-center gap-[10px] pointer">|</li>

<li className="text-[#ffffff] flex flex-row item-center gap-[10px] pointer" > 
      {/* Draggable Element */}
      <div
        id="add-text"
        draggable="true"
        onDragStart={(event) => handleDragStart(event, "draggable-text")}
        style={{
        
       
          textAlign: "center",
          lineHeight: "50px",
          cursor: "grab",
          userSelect: "none",
        }}
      ><Type />  </div>Text</li>
      <li className="text-[#ffffff] flex flex-row item-center gap-[10px] pointer">|</li>
<li className="text-[#ffffff] flex flex-row item-center gap-[10px] pointer" > 
      {/* Draggable Element */}
      <div
        id="add-container"
        draggable="true"
        onDragStart={(event) => handleDragStart(event, "draggable-container")}
        style={{
        
       
          textAlign: "center",
          lineHeight: "50px",
          cursor: "grab",
          userSelect: "none",
        }}
      >  <Book />  </div>Container</li>      
    <li className="text-[#ffffff] flex flex-row item-center gap-[10px] pointer">|</li>

    <li className="text-[#ffffff] flex flex-row item-center gap-[10px] pointer" > 
      {/* Draggable Element */}
      <div
      onClick={AddModelBox}
       
        style={{
        
       
          textAlign: "center",
          lineHeight: "50px",
          cursor: "pointer",
          userSelect: "none",
        }}
      >  <MessageSquare />  </div>Add Modal Box</li>   
       <li className="text-[#ffffff] flex flex-row item-center gap-[10px] pointer" > 
      {/* Draggable Element */}
      <div
      onClick={AddModelBoxClickTrack}
       
        style={{
        
       
          textAlign: "center",
          lineHeight: "50px",
          cursor: "pointer",
          userSelect: "none",
        }}
      >  <MousePointer /> </div>Click Tracking</li>   
      </ul>
     </div>
     </>
    )
  }
  