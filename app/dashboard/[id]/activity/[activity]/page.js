'use client';

import { useState, useRef, useEffect , useContext } from 'react';
import axios from 'axios';
import grapesjs from 'grapesjs';
import { Input } from "@/components/ui/input";
import { fetchActivity , updateActivity, deleteCodeItem , fetchProjectById} from '@/app/api/api';
import { SendHorizontal, Trash2, X } from "lucide-react"
import EditTextPopup from '@/app/elements/edit-text';
import ClipLoader from "react-spinners/ClipLoader"; 
import { AppContext } from "@/app/context/provider";
//import 'grapesjs/dist/css/grapes.min.css';
//import 'grapesjs-preset-webpage';
import Header from "@/include/header";
import { DragBar } from '@/app/elements/dragBar';
import { Dialog, DialogOverlay  } from "@/app/elements/alert-dialog";
import { ContainerBox } from '@/app/elements/container-box';
import { TextBox } from '@/app/elements/text-box';
import RichTextEditor from '@/app/elements/RichTextEditor';

const VisualEditor = () => {

  let newChange = '';
  const [editor, setEditor] = useState(null);
  const [activity, setActivityData] = useState('');
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const iframeRef = useRef(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [history, setHistory] = useState([]);
  const [changes, setChanges] = useState([]); // Track all changes
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [currentElement, setCurrentElement] = useState(null);
  const [dBChanges, setDbChanges] = useState([]);
  const [activityBar, setActivityBar] = useState(false);
const [eleData, setEleData] = useState();
  const [open, setOpen] = useState(false);
  const [textBox , setTextBoxOpen] = useState();
  const projectId =window.location.pathname.split("/activity/")[0].split("dashboard/")[1];
  const activityId = window.location.pathname.split("/activity/")[1]; // Assuming the activityId is at index 3
  function getFullSelector(element) {
    let path = [];
    const projectId =window.location.pathname.split("/activity/")[0].split("dashboard/")[1];
    while (element && element.nodeType === 1) { // Ensure the element is an element node
      let selector = element.nodeName.toLowerCase(); // Default to the tag name
  
      // If the element has an ID, use it
      if (element.id) {
        selector = `#${element.id}`;
      } else if (element.classList.length > 0) {
        // Filter out classes that contain 'prexy-' and append the rest
        const filteredClasses = [...element.classList].filter(className => !className.startsWith('prezy-'));
        if (filteredClasses.length > 0) {
          selector = `${selector}.${filteredClasses.join('.')}`; // Append the remaining classes
        }
      }
  
      // Append the selector to the path
      path.unshift(selector);
  
      // Move to the parent element
      element = element.parentElement;
    }
  
    // Return the full selector path
    return path.join(' > ');
  }

  const handleEditClick = (element) => {
    setCurrentElement(element);
    setCurrentText(element.innerHTML);
    setIsPopupOpen(true);
  };

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
  useEffect(() => {
    const url = window.location.pathname; // Get the current URL path
    const pathParts = url.split('/activity/'); // Split the URL by '/'
    
    const projectId =window.location.pathname.split("/activity/")[0].split("dashboard/")[1]; // Assuming the projectId is at index 1
    const activityId = window.location.pathname.split("/activity/")[1]; // Assuming the activityId is at index 3

    fetchActivity(projectId, activityId)
    .then((data) => {
      setActivityData(data.activity);
      setUrl(data?.activity?.activityUrl);
      loadWebsite(data?.activity?.activityUrl)
    })
    .catch((error) => {
      console.error('Failed to fetch activity:', error);
    });
  }, []);



  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Handle drop event inside iframe
  const handleDrop = (event) => {
    event.preventDefault();
    const draggedHTMl = event.dataTransfer.getData("text/plain");


    if (draggedHTMl && event.target.id.includes("personalized-element"))  {
      // Append the dragged element inside iframe's body
      if(draggedHTMl == "slider") {
        iframeDoc.body.appendChild(draggedHTMl);
      }

      if(draggedHTMl == "draggable-container") {
        setEleData({
          htmlIt : draggedHTMl,
          eleMent : event.target.id,
          iframeDoc : iframeRef
        })
        setOpen(true)
       // iframeRef.body.appendChild(draggedHTMl);
      }

      if (draggedHTMl === "draggable-text") {
        setEleData({
          htmlIt: "",
          eleMent: event.target.id,
          iframeDoc: iframeRef
        });
      var targetEleId = "#" + event.target.id;
        const targetEle = iframeRef.current.contentDocument.body.querySelector("#" + event.target.id);
        if (!targetEle) return; // Ensure the element exists before proceeding
      
        const EditorDiv = iframeRef.current.contentDocument.createElement("div");
        const button = iframeRef.current.contentDocument.createElement("button");
        const textEditor = iframeRef.current.contentDocument.createElement("DIV");
        textEditor.classList.add("editor-tool");
        EditorDiv.classList.add("editor-div");
        button.textContent = "Apply Changes";
        button.classList.add("apply-changes");
      
        EditorDiv.style.minHeight = "300px";
        EditorDiv.style.marginBottom = "50px";
      
       
        targetEle.appendChild(EditorDiv);
       
        EditorDiv.appendChild(textEditor);
        EditorDiv.appendChild(button);
        
        iframeRef.current.contentWindow.quill = new iframeRef.current.contentWindow.Quill(textEditor, {
          theme: "snow",
          modules: {
            toolbar: [
              [{ font: [] }, { size: [] }], // Font and Size
              [{ header: [1, 2, 3, 4, 5, 6, false] }], // Headers
              ["bold", "italic", "underline", "strike"], // Text Formatting
              [{ color: [] }, { background: [] }], // Text Colors
              [{ script: "sub" }, { script: "super" }], // Subscript / Superscript
              [{ align: [] }], // Text Alignment
              [{ list: "ordered" }, { list: "bullet" }, { list: "check" }], // Lists
              [{ indent: "-1" }, { indent: "+1" }], // Indentation
              ["blockquote", "code-block"], // Block Styles
              ["link", "image", "video"], // Media
              ["clean"] // Clear Formatting
            ]
          }
        });
        targetEle?.querySelector(".dropable-div")?.classList.add("hide");
        button.addEventListener("click", function(){
var html =  iframeRef.current.contentWindow.quill.root.innerHTML;

updateActivity(projectId, activityId, 
  {"htmlCode": [
    {
      "type" : "html-modified",
      "selector":targetEleId,
      "newText": `<div class="ql-content">${html}</div>`
    }
],
  

}
)
.then((data) => {
setActivityData(data.activity);
setLoading(false);
loadWebsite(url);

  console.log("Update successful!", data);
})
.catch((error) => {
  console.error("Update failed", error);
});




        })
       
      }
      
     
  
    }
  };

 

  // Function to load the website content into the iframe
  const loadWebsite = async (url) => {
    if (!url) return;
  
    // Reset iframe content before executing function
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write("<html><head></head><body></body></html>");
      iframeDoc.close();
    }
  
    try {
      const projectId = window.location.pathname.split("/activity/")[0].split("dashboard/")[1]; // Extract projectId
      const data = await fetchProjectById(projectId);
  
      if (data) {
        fetch(`${process.env.NEXT_PUBLIC_NODE_API_URL}/api/proxy?url=${encodeURIComponent(url)}&jsPath=${data.jsFilePath.split('/public')[1]}`)
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to fetch the website.");
            }
            return res.text();
          })
          .then((html) => {
            if (iframeRef.current) {
              const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
  
              iframeDoc.open();
              iframeDoc.write(html);
              iframeDoc.close();
  
              let executed = false; // Flag to ensure execution happens once
  
              const executeScripts = () => {
                if (!executed) {
                  executed = true; // Prevent duplicate execution
                  setLoading(true);
                  VecRenderChanges();
                  setTimeout(() => {
                    injectHighlightCSS(iframeDoc);
                    addHoverHighlighting(iframeDoc);
                    addContextMenu(iframeDoc);
                    enableDragAndDrop(iframeDoc);
                    setLoading(false);
                    iframeDoc.addEventListener("dragover", handleDragOver);
                    iframeDoc.addEventListener("drop", handleDrop);
                  }, 3000);
                }
              };
  
              // First attempt: Wait for iframe to load completely
              iframeRef.current.onload = executeScripts;
  
              // Fallback: Listen for DOMContentLoaded in case onload doesn't trigger
              iframeDoc.addEventListener("DOMContentLoaded", executeScripts);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  
  

  // Save current iframe state to history (Undo stack)
  const saveStateToHistory = (iframeDoc) => {
    const currentHTML = iframeDoc.documentElement.outerHTML;
    setHistory((prevHistory) => [...prevHistory, currentHTML]);
  };

  
  const handleSaveText = (newText) => {
    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
    if (currentElement) {
   
      currentElement.innerHTML = newText;
       newChange = `Changed text of element with tag ${getFullSelector(currentElement).slice(0, 70)}... to <p>${newText}</p>`;
    

       
       setDbChanges((prevHistory) => [...prevHistory, {
        "type" : "modified",
          "selector":  getFullSelector(currentElement).replace(/(?<=\bhtml\b)(\.[a-zA-Z0-9\-_]+)*|(?<=\bbody\b)(\.[a-zA-Z0-9\-_]+)*/g, ''),
          "newText": newText
        }
       ]);
 const projectId =window.location.pathname.split("/activity/")[0].split("dashboard/")[1]; // Assuming the projectId is at index 1
    const activityId = window.location.pathname.split("/activity/")[1]; // Assuming the activityId is at index 3
    setLoading(true);
       updateActivity(projectId, activityId, 
        {"htmlCode": [
          {
            "type" : "html-modified",
            "selector":  getFullSelector(currentElement).replace(/(?<=\bhtml\b)(\.[a-zA-Z0-9\-_]+)*|(?<=\bbody\b)(\.[a-zA-Z0-9\-_]+)*/g, ''),
            "newText": newText
          }
      ],
        
      
      }
      )
    .then((data) => {
      setActivityData(data.activity);
      setLoading(false);
      loadWebsite(url);
     
        console.log("Update successful!", data);
    })
    .catch((error) => {
        console.error("Update failed", error);
    });

  
      console.log(dBChanges); // Handle the change log however you want

      if (newChange) {
        setChanges((prevChanges) => [...prevChanges, newChange]);
        console.log(changes)
        console.log(history)
        saveStateToHistory(iframeDoc); // Save state after the change
        setCurrentText(null)
      }
    }
  };

  // Handle the Undo action (Ctrl + Z)
  const handleUndo = () => {
    if (history.length <= 1) return; // No previous state to undo to

    const previousState = history[history.length - 2]; // Get the previous state
    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
    
    // Restore the previous state
    iframeDoc.open();
    iframeDoc.write(previousState);
    iframeDoc.close();
    
    // Remove the latest state from the history
    setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
  };

  // Listen for Ctrl + Z to trigger undo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault(); // Prevent the default browser undo
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [history]);

  // Inject custom CSS for the highlighted class in the iframe
  const injectHighlightCSS = (iframeDoc) => {
    const style = iframeDoc.createElement('style');
    style.innerHTML = `
      .highlighted {
        outline: 1.5px solid rgba(0, 81, 255, 0.7);
        background-color: rgba(111, 0, 255, 0.15);
      }
    `;
    iframeDoc.head.appendChild(style);
  };

  // Function to add hover highlighting to the elements in the iframe
  const addHoverHighlighting = (iframeDoc) => {
    const body = iframeDoc.body;
    const allElements = body.querySelectorAll('*:not(.editor-div):not(.exclude2)');

    allElements.forEach((element) => {
      element.addEventListener('mouseover', (event) => {
        event.target.classList.add('highlighted');
      });

      element.addEventListener('mouseout', (event) => {
        event.target.classList.remove('highlighted');
      });

      element.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent context menu or other click events
        if (selectedElement) {
          selectedElement.classList.remove('prezy-selected');
        }
        setSelectedElement(element);
        element.classList.add('prezy-selected');
      });
    });
  };

  // Enable drag-and-drop functionality for highlighted elements only
  const enableDragAndDrop = (iframeDoc) => {
    const body = iframeDoc.body;

    // Make only the highlighted element draggable
    body.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('highlighted')) {
        // Store the element being dragged in dataTransfer
        e.dataTransfer.setData('text/plain', e.target.outerHTML);
        e.target.classList.add('dragging');
      } else {
        e.preventDefault();
      }
    });

    body.addEventListener('dragover', (e) => {
      // Allow drop on valid target
      e.preventDefault();
    });

    body.addEventListener('drop', (e) => {
      e.preventDefault();

      const droppedHTML = e.dataTransfer.getData('text/plain');
      const dropTarget = e.target;

      // Only drop on valid elements (not the dragged one)
      if (dropTarget && dropTarget !== e.target.closest('.dragging')) {
        dropTarget.insertAdjacentHTML('beforebegin', droppedHTML);
        e.target.closest('.dragging')?.remove(); // Remove the dragged element after drop
        saveStateToHistory(iframeDoc); // Save state after drag-drop
      }
    });

    body.addEventListener('dragend', (e) => {
      e.target.classList.remove('dragging');
    });
  };

  // Function to add context menu functionality
  const addContextMenu = (iframeDoc) => {
    const body = iframeDoc.body;
    const allElements = body.querySelectorAll('*:not(.editor-div)');

    allElements.forEach((element) => {
      element.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();

        setSelectedElement(element);

        const x = e.clientX;
        const y = e.clientY;

        setContextMenu({
          x: x,
          y: y,
        });
      });
    });
  };

  // Handle actions in the context menu
  const handleMenuAction = (action) => {
    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
    const element = selectedElement;

   

    switch (action) {
      case 'edit-text':
        
        if (element && element.innerHTML) {
          handleEditClick(element);
         
         // if (newText !== null) {
          //  element.innerHTML = newText;
           // newChange = `Changed text of element with tag ${getFullSelector(element).slice(0, 70)}... to  <p>${newText}</p>`;
         // }
        }
        break;
      case 'remove-element':
        if (element) {
          element.remove();
          newChange = `Removed element with tag ${getFullSelector(element).replace(/(?<=\bhtml\b)(\.[a-zA-Z0-9\-_]+)*|(?<=\bbody\b)(\.[a-zA-Z0-9\-_]+)*/g, '')}`;
        }
        break;
      case 'insert-before':
        if (element) {
          const newElement = document.createElement('div');
          newElement.id= "personalized-element-" + generateDateTime4DigitCode();
          newElement.innerText = 'New Element Inserted';
          element.parentNode.insertBefore(newElement, element);
          newChange = newElement;
          const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
         
      
          //newElement.innerHTML = newText;
            setDbChanges((prevHistory) => [...prevHistory, {
              "type" : "inserted-before",
                "selector":  getFullSelector(element).replace(/(?<=\bhtml\b)(\.[a-zA-Z0-9\-_]+)*|(?<=\bbody\b)(\.[a-zA-Z0-9\-_]+)*/g, ''),
                "newText": newElement
              }
             ]);
             const projectId =window.location.pathname.split("/activity/")[0].split("dashboard/")[1]; // Assuming the projectId is at index 1
          const activityId = window.location.pathname.split("/activity/")[1]; // Assuming the activityId is at index 3
          setLoading(true);
             updateActivity(projectId, activityId, 
              {"htmlCode": [
                {
                  "type" : "inserted-before",
                  "selector":  getFullSelector(element).replace(/(?<=\bhtml\b)(\.[a-zA-Z0-9\-_]+)*|(?<=\bbody\b)(\.[a-zA-Z0-9\-_]+)*/g, ''),
                  "newText": newElement.outerHTML
                }
            ],
              
            
            }
            )
          .then((data) => {
              console.log("Update successful!", data);
            
              setActivityData(data.activity);
              loadWebsite(url);
          })
          .catch((error) => {
              console.error("Update failed", error);
          });
      
        
            console.log(dBChanges); // Handle the change log however you want
      
            if (newChange) {
              setChanges((prevChanges) => [...prevChanges, newChange]);
              console.log(changes)
              console.log(history)
              saveStateToHistory(iframeDoc); // Save state after the change
              setCurrentText(null)
            }
    
        }
        break;
      case 'insert-after':
        if (element) {
          const newElement = document.createElement('div');
          newElement.id = "personalized-element-" + generateDateTime4DigitCode();
          newElement.innerText = 'New Element Inserted';
          
          // Insert the new element after 'element'
          element.parentNode.insertBefore(newElement, element.nextSibling);
          
          newChange = newElement;
          
          const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
          
     
           
           
        
            //newElement.innerHTML = newText;
              setDbChanges((prevHistory) => [...prevHistory, {
                "type" : "inserted-after",
                  "selector":  getFullSelector(element).replace(/(?<=\bhtml\b)(\.[a-zA-Z0-9\-_]+)*|(?<=\bbody\b)(\.[a-zA-Z0-9\-_]+)*/g, ''),
                  "newText": newChange
                }
               ]);
               const projectId =window.location.pathname.split("/activity/")[0].split("dashboard/")[1]; // Assuming the projectId is at index 1
            const activityId = window.location.pathname.split("/activity/")[1]; // Assuming the activityId is at index 3
               updateActivity(projectId, activityId, 
                {"htmlCode": [
                  {
                    "type" : "inserted-after",
                    "selector":  getFullSelector(element).replace(/(?<=\bhtml\b)(\.[a-zA-Z0-9\-_]+)*|(?<=\bbody\b)(\.[a-zA-Z0-9\-_]+)*/g, ''),
                    "newText": newElement.outerHTML
                  }
              ],
                
              
              }
              )
            .then((data) => {
                console.log("Update successful!", data);
                setActivityData(data.activity);
                loadWebsite(url);
            })
            .catch((error) => {
                console.error("Update failed", error);
            });
        
          
              console.log(dBChanges); // Handle the change log however you want
        
              if (newChange) {
                setChanges((prevChanges) => [...prevChanges, newChange]);
                console.log(changes)
                console.log(history)
                saveStateToHistory(iframeDoc); // Save state after the change
                setCurrentText(null)
              }
      
          
        }
        break;
      case 'remove-image':
        if (element && element.tagName === 'IMG') {
          element.remove();
          newChange = `Removed image element with src ${element.src}`;
        }
        break;
      case 'replace-image':
        if (element && element.tagName === 'IMG') {
          const newImageUrl = prompt('Enter new image URL:', element.src);
          if (newImageUrl) {
            element.src = newImageUrl;
            newChange = `Replaced image with new source ${newImageUrl}`;
          }
        }
        break;
      default:
        break;
    }

    if (newChange) {
      setChanges((prevChanges) => [...prevChanges, newChange]);
      saveStateToHistory(iframeDoc); // Save state after the change
    }

    setContextMenu(null); // Close the context menu
  };

  // Function to generate JavaScript for all changes
  const generateJavaScriptCode = () => {
    const code = changes.map((change) => {
      if (change.startsWith('Changed text')) {
        return `document.querySelector('elementSelector').innerText = 'New Text';`;
      }
      // Add more cases for other changes as per the action
    }).join('\n');
    return code;
  };

  // Render the context menu
  const renderContextMenu = () => {
    if (!contextMenu || !selectedElement) return null;

    const { x, y } = contextMenu;
    const isImage = selectedElement.tagName === 'IMG';

    return (
      <div
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          padding: '5px 0',
          boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
          zIndex: 1000,
        }}
      >
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li onClick={() => handleMenuAction('edit-text')}  style={{ padding: '8px', cursor: 'pointer' }}>
            Edit Text
          </li>
          <li onClick={() => handleMenuAction('remove-element')} style={{ padding: '8px', cursor: 'pointer' }}>
            Remove Element
          </li>
          <li onClick={() => handleMenuAction('insert-before')} style={{ padding: '8px', cursor: 'pointer' }}>
            Insert Before
          </li>
          <li onClick={() => handleMenuAction('insert-after')} style={{ padding: '8px', cursor: 'pointer' }}>
            Insert After
          </li>
          {isImage && (
            <>
              <li onClick={() => handleMenuAction('remove-image')} style={{ padding: '8px', cursor: 'pointer' }}>
                Remove Image
              </li>
              <li onClick={() => handleMenuAction('replace-image')} style={{ padding: '8px', cursor: 'pointer' }}>
                Replace Image
              </li>
            </>
          )}
        </ul>
      </div>
    );
  };

  const removePer = (change) => {
    setLoading(true);
    var changeType;
    const projectId =window.location.pathname.split("/activity/")[0].split("dashboard/")[1]; // Assuming the projectId is at index 1
    const activityId = window.location.pathname.split("/activity/")[1]; // Assuming the activityId is at index 3
    if(change?.type == "html-modified" || change?.type == "text-editor" || change?.type == "inserted-after" || change?.type == "remove-element" || change?.type == "container-added" || change?.type == "inserted-before" ) {
      changeType = "htmlCode"
    }
   
    deleteCodeItem(projectId, activityId, changeType, change._id)
    .then(data => {
      console.log("changes deleted sucessfully")
      setActivityData(data.activity);
      setLoading(false);
      loadWebsite(url);
    })
    .catch(err => {
        console.error("Error:", err.message);
    });
}

const loadWebsiteUrl = () =>{
  loadWebsite(url)
}
  return (
    <>
     {currentText && <EditTextPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        initialText={currentText}
        onSave={handleSaveText}
      /> }
    <Header/>
  {activity &&  <div className='w-full bg-[#333333] py-[10px] px-[20px] flex flex-row items-center justify-between sticky top-0 z-10 '>
      <div className='w-[30%]'><h2 className='text-[#ffffff] text-[22px] font-bold' title={activity.activityName}>{activity.activityType.toUpperCase()} :: {activity.activityName}</h2></div>
      <div className='w-[70%] flex flex-row items-center justify-between gap-5'>
<div className='search-bx flex flex-row  gap-2 items-center w-full'>
    <input 
          type="text"
          className="w-full p-2 mb-0 border rounded"
          placeholder="Enter Website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className=" p-2 text-white  bg-[#6a45f9] rounded "
          onClick={()=> loadWebsite(url)}
        >
         <SendHorizontal />
        </button>
        </div>
        <div className='flex flex-row gap-2 items-center'>
     
        </div>
        </div>
    </div> }
    {activity &&  <div className="flex h-screen">
{activityBar &&
      <div className="w-1/4 p-4 bg-gray-100 shadow-xl rounded-lg h-screen ">
      

        <h3 className="mt-4 text-lg font-semibold relative">Changes: <span className='absolute right-0 top-[-15px]' onClick={(e)=> setActivityBar(!activityBar)}><X /></span></h3>
        <ul className="mt-2 h-[70vh] overflow-y-scroll overflow-x-hidden">

          {activity?.htmlCode.map((change, index) => (
            <li key={change._id} data-changeId={change._id} className="mb-2 text-[13px] leading-5 px-2 bg-[#ffffff] py-2 rounded rounded-lg border-2 border-gray-400 relative overflow-hidden">
              {loading && <div className='w-full absolute bg-[#f5f5f5] h-full z-10 left-0 top-0 bg-opacity-75 flex items-center justify-center flex-row'>  <ClipLoader size={30} color="#888888" /></div>}
              <h3 className='font-bold mb-2'>{change?.type}</h3>
              <hr/>
              <p className='m-2' title={change?.selector}>{change?.selector.substring(0, 70) + "..."}</p>
              <hr/>
              <p className='m-2'>{change?.newText}</p>
              <span className='absolute top-2 right-2 cursor-pointer'><Trash2 className='w-[15px]' onClick={()=>removePer(change)} /></span>
            </li>
          ))}
        </ul>

       
      </div>
    }
      <div className="relative w-full">
      {loading &&  <div className='w-full absolute bg-[#f5f5f5] h-full z-10 left-0 top-0 bg-opacity-75 flex items-center justify-center flex-row'>  <ClipLoader size={30} color="#888888" /></div>}
        <iframe
          ref={iframeRef}
          style={{ width: '100%', height: '100vh' }}
          src="about:blank"
          title="Website Preview"
          sandbox="allow-scripts allow-same-origin"
        ></iframe>
        {renderContextMenu()}
        <DragBar setActivityBar={setActivityBar} activityBar={activityBar}/>
      </div>
       <Dialog open={open} setOpen={setOpen} >
                     <ContainerBox open={open} setOpen={setOpen}  eleData={eleData} projectId={projectId} activityId={activityId} setActivityData={setActivityData} loadWebsiteUrl={loadWebsiteUrl}/>
                    </Dialog>

                    <Dialog open={textBox} setOpen={setTextBoxOpen} className="z-[5]" >
                     <TextBox open={textBox} setOpen={setTextBoxOpen}  eleData={eleData} projectId={projectId} activityId={activityId} setActivityData={setActivityData} loadWebsiteUrl={loadWebsiteUrl}/>
                   
                    </Dialog>
    </div> }
    </>
  );
};

export default VisualEditor;
