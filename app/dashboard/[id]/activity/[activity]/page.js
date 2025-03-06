'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import grapesjs from 'grapesjs';
import { fetchActivity , updateActivity } from '@/app/api/api';
import { SendHorizontal, Trash2 } from "lucide-react"
import EditTextPopup from '@/app/elements/edit-text';
//import 'grapesjs/dist/css/grapes.min.css';
//import 'grapesjs-preset-webpage';
import Header from "@/include/header";
const VisualEditor = () => {
  let newChange = '';
  const [editor, setEditor] = useState(null);
  const [activity, setActivityData] = useState('');
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
  function getFullSelector(element) {
    let path = [];
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



 

  // Function to load the website content into the iframe
  const loadWebsite = (url) => {
    if (!url) return ;

    fetch(`${process.env.NEXT_PUBLIC_NODE_API_URL}/api/proxy?url=${encodeURIComponent(url)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch the website.');
        }
        return res.text();
      })
      .then((html) => {

  
        if (iframeRef.current) {
          const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
          
          iframeDoc.open();
          iframeDoc.write(html);
          iframeDoc.close();
      
          // Wait for the iframe's document to fully load (DOMContentLoaded or load event)
          iframeRef.current.onload = () => {
              // These will only run after iframe content is ready
              injectHighlightCSS(iframeDoc);
              addHoverHighlighting(iframeDoc);
              addContextMenu(iframeDoc);
              enableDragAndDrop(iframeDoc);
      
              saveStateToHistory(iframeDoc);
          };
      
          // Optional: If you want to use DOMContentLoaded inside the iframe itself
          iframeDoc.addEventListener('DOMContentLoaded', () => {
              injectHighlightCSS(iframeDoc);
              addHoverHighlighting(iframeDoc);
              addContextMenu(iframeDoc);
              enableDragAndDrop(iframeDoc);
      
              saveStateToHistory(iframeDoc);
          });
      }
      
      })
      .catch((error) => {
        console.error(error);
        //alert('Failed to load the website. Please check the URL and try again.');
      });
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
          "selector":  getFullSelector(currentElement),
          "newText": newText
        }
       ]);
 const projectId =window.location.pathname.split("/activity/")[0].split("dashboard/")[1]; // Assuming the projectId is at index 1
    const activityId = window.location.pathname.split("/activity/")[1]; // Assuming the activityId is at index 3
       updateActivity(projectId, activityId, 
        {"htmlCode": [
          {
            "type" : "html-modified",
            "selector":  getFullSelector(currentElement),
            "newText": newText
          }
      ],
        
      
      }
      )
    .then((data) => {
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
        outline: 4px dashed rgba(255, 0, 0, 0.7);
        background-color: rgba(255, 0, 0, 0.1);
      }
    `;
    iframeDoc.head.appendChild(style);
  };

  // Function to add hover highlighting to the elements in the iframe
  const addHoverHighlighting = (iframeDoc) => {
    const body = iframeDoc.body;
    const allElements = body.querySelectorAll('*');

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
    const allElements = body.querySelectorAll('*');

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
          newChange = `Removed element with tag ${getFullSelector(element)}`;
        }
        break;
      case 'insert-before':
        if (element) {
          const newElement = document.createElement('div');
          newElement.innerText = 'New Element Inserted';
          element.parentNode.insertBefore(newElement, element);
          newChange = `Inserted new div element before ${getFullSelector(element)}`;
          const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
         
      
          //newElement.innerHTML = newText;
            setDbChanges((prevHistory) => [...prevHistory, {
              "type" : "inserted-before",
                "selector":  getFullSelector(element),
                "newText": newChange
              }
             ]);
             const projectId =window.location.pathname.split("/activity/")[0].split("dashboard/")[1]; // Assuming the projectId is at index 1
          const activityId = window.location.pathname.split("/activity/")[1]; // Assuming the activityId is at index 3
             updateActivity(projectId, activityId, 
              {"htmlCode": [
                {
                  "type" : "inserted-before",
                  "selector":  getFullSelector(element),
                  "newText": newChange
                }
            ],
              
            
            }
            )
          .then((data) => {
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
        break;
      case 'insert-after':
        if (element) {
          const newElement = document.createElement('div');
          newElement.innerText = 'New Element';
          element.parentNode.insertBefore(newElement, element.nextSibling);
          newChange = `Inserted new div element after ${getFullSelector(element)}`;

      
     
            const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
           
        
            //newElement.innerHTML = newText;
              setDbChanges((prevHistory) => [...prevHistory, {
                "type" : "inserted-after",
                  "selector":  getFullSelector(element),
                  "newText": newChange
                }
               ]);
               const projectId =window.location.pathname.split("/activity/")[0].split("dashboard/")[1]; // Assuming the projectId is at index 1
            const activityId = window.location.pathname.split("/activity/")[1]; // Assuming the activityId is at index 3
               updateActivity(projectId, activityId, 
                {"htmlCode": [
                  {
                    "type" : "inserted-after",
                    "selector":  getFullSelector(element),
                    "newText": newChange
                  }
              ],
                
              
              }
              )
            .then((data) => {
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

  const removePer = (index) => {
    const updatedHistory = history.filter((_, i) => i !== index+2);  // Remove item at `index`

    console.log('Updated History:', updatedHistory);

    // Call saveStateToHistory with the updated array
    saveStateToHistory(updatedHistory); 
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
        <button
          className="w-[200px] p-2 text-white  bg-green-500 rounded hover:bg-green-600"
          onClick={handleUndo}  >Save Activity</button>
        </div>
        </div>
    </div> }
    {activity &&  <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-100 shadow-xl rounded-lg h-screen ">
      

        <h3 className="mt-4 text-lg font-semibold">Changes:</h3>
        <ul className="mt-2 h-[70vh] overflow-y-scroll overflow-x-hidden">
          {activity?.htmlCode.map((change, index) => (
            <li key={index} className="mb-2 text-[13px] leading-5 px-2 bg-[#ffffff] py-2 rounded rounded-lg border-2 border-gray-400 relative">
              <h3 className='font-bold mb-2'>{change?.type}</h3>
              <hr/>
              <p className='m-2' title={change?.selector}>{change?.selector.substring(0, 70) + "..."}</p>
              <hr/>
              <p className='m-2'>{change?.newText}</p>
              <span className='absolute top-2 right-2 cursor-pointer'><Trash2 className='w-[15px]' onClick={()=>removePer(index)} /></span>
            </li>
          ))}
        </ul>

       
      </div>

      <div className="relative w-full">
        <iframe
          ref={iframeRef}
          style={{ width: '100%', height: '100vh' }}
          src="about:blank"
          title="Website Preview"
          sandbox="allow-scripts allow-same-origin"
        ></iframe>
        {renderContextMenu()}
      </div>
    </div> }
    </>
  );
};

export default VisualEditor;
