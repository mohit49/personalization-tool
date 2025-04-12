import { SquarePen } from "lucide-react";
import { useState, useRef, useEffect, useContext } from "react";
import { AppContext } from "@/app/context/provider"; // Import AppContext
import {
  updateActivity,
  fetchModal,
  updateModal,
  deletActivity,
  updateTextEditorData
} from "@/app/api/api";
const apiUrl = "https://app.mazzl.ae/api/auth";
export function exicutesFunctions({
  projectId,
  activityId,
  iframeDoc,
  setOpenModal,
  modalId,
  modalEdited,
  deleteCodeItem,
  setModalid,
  setModalEdited,
  setActivityData,
  setLoading,
  loadWebsite,
}) {
  const body = iframeDoc.body;
  const allElements = body.querySelectorAll(
    "*:not(.editor-div):not(.non-editable)"
  );
  const allModal = body?.querySelectorAll(".prezify-popup");

  allModal.forEach((ele) => {
    const toolbarDiv = document.createElement("div");
    toolbarDiv.classList.add("prezify-editable");
    // Manually creating the SVG as a string (you could inspect the SVG from the library or use it directly)
    const squarePenIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>`;
    const deleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`;
    // Use the manually added SVG as part of your content
    toolbarDiv.innerHTML = `<div>Modal Settings</div> <div><span class="edit-modal" >${squarePenIconSVG}</span> <span class="delete-modal">${deleteIcon}</span></div>`;

    Object.assign(toolbarDiv.style, {
      backgroundColor: "#2a2a2a",
      color: "#ffffff",
      padding: "10px",
      margin: "0px",
      fontSize: "16px",
      textAlign: "center",
      width: "100%",
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "5px",
      justifyContent: "space-between", // Items aligned at the start and end
      alignItems: "center", // Center items vertically
    });

    Object.assign(ele.style, {
      border: "1px #cccccc solid",
      width: "100%",
    });

    // Prepend the new div inside the element
    ele.prepend(toolbarDiv);

    ele
      .querySelector(".edit-modal")
      .addEventListener("click", function (event) {
        setModalid(
          event.currentTarget.closest(".prezify-popup").dataset.modelId
        );
        setOpenModal(true);
        setModalEdited(true);
      });

    ele
      .querySelector(".delete-modal")
      .addEventListener("click", function (event) {
        setLoading(false);
        setModalid(
          event.currentTarget.closest(".prezify-popup").dataset.modelId
        );
        deleteCodeItem(
          projectId,
          activityId,
          "htmlCode",
          event.currentTarget.closest(".prezify-popup").dataset.modelId
        )
          .then((data) => {
            console.log("changes deleted sucessfully");
            setActivityData(data.activity);
            setLoading(false);
            loadWebsite(data?.activity?.activityUrl);
          })
          .catch((err) => {
            console.error("Error:", err.message);
          });
      });
  });
}

export function exicuteTextEditor({
  projectId,
  activityId,
  iframeDoc,
  iframeRef,
  setOpenModal,
  modalId,
  modalEdited,
  deleteCodeItem,
  setModalid,
  setModalEdited,
  setActivityData,
  setLoading,
  loadWebsite,
}) {
  var iframeRf = iframeRef;
  const body = iframeDoc.body;
  const allModal = body?.querySelectorAll(".ql-content");
  allModal.forEach((ele) => {
    const editorId = ele.parentNode.dataset.id;
    const EditorDiv =
    iframeRf.current.contentDocument.createElement("div");
  const button =
  iframeRf.current.contentDocument.createElement("button");
  const buttonHTML =
  iframeRef.current.contentDocument.createElement("button");
  const textEditor =
    iframeRef.current.contentDocument.createElement("DIV");
  textEditor.classList.add("editor-tool");
  EditorDiv.classList.add("editor-div");
  button.textContent = "Apply Changes";
  button.classList.add("apply-changes");
  buttonHTML.textContent = "Edit HTML";
        buttonHTML.classList.add("edit-html");
  EditorDiv.style.minHeight = "300px";
  EditorDiv.style.marginBottom = "50px";


  ele.parentNode.insertBefore(EditorDiv, ele.nextSibling);

  EditorDiv.appendChild(textEditor);
  EditorDiv.appendChild(button);
  EditorDiv.appendChild(buttonHTML);
  iframeRf.current.contentWindow.quill = new iframeRf.current.contentWindow.Quill(ele, {
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
          ["clean"], 
          [
            'bold', 'italic', 'underline',  // Existing buttons
            {
              name: 'customButton',
              action: function () {
                alert('Custom button clicked!');
              },
              className: 'fa fa-pencil',  // Or your custom icon class or image URL
              title: 'Custom Button'
            }
          ]
        ]
      },
    });

     // Image handler for the 'image' button in the toolbar
     var ImageHandler = function() {
      // Create a file input element dynamically inside the iframe's document
      var input = iframeRef?.current?.contentDocument?.createElement('input');
      iframeRef?.current?.contentDocument?.body?.appendChild(input);
      input.setAttribute('type', 'file');
      input.style.display = 'none'; // Hide the input element
      input.click(); // Trigger the file selection dialog
    
      // Add an event listener for when the file selection changes
      input.onchange = function(event) {
       const eventD = event;
       eventD.preventDefault();
       eventD.stopPropagation();
        var file = input.files[0];
        
        if (!file) {
          return;
        }
        
        // Create a new FormData object and append the selected file
        var formData = new FormData();
        formData.append('image', file);
        formData.append("projectId", projectId);
        formData.append("activityId", activityId);
    
        // Make the fetch request to upload the file
        fetch(`${apiUrl}/project/${projectId}/activity/${activityId}/uploadFile`, {
          method: 'POST',
          body: formData, // Use FormData directly, which automatically sets the correct headers
          credentials: 'include', // Include credentials like cookies
        })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
          const imageUrl = data.filePath;
    
          // Insert the image URL into the Quill editor at the current cursor position
          var range = iframeRef.current.contentWindow.quill.getSelection();
          iframeRef.current.contentWindow.quill.insertEmbed(range.index, 'image', imageUrl);
          eventD.stopPropagation();
           eventD.preventDefault();
        })
        .catch(error => {
          console.log("Error uploading image:", error);
        })
        .finally(() => {
          // Clean up by removing the input element after use
          input.remove();
          eventD.preventDefault();
          eventD.stopPropagation();
        });
      };
    };
    
  iframeRef.current.contentWindow.quill.getModule('toolbar').addHandler('image', ImageHandler);




    button.addEventListener("click", function () {
      var html = iframeRef.current.contentWindow.quill.root.innerHTML;
      html =  html.replace("/static","https://app.mazzl.ae/static")
      setLoading(true);
      updateTextEditorData(projectId, activityId, editorId, {
        htmlCode: [
          {
            newText: `<div class="ql-content">${html}</div>`,
          },
        ],
      })
        .then((data) => {
          setActivityData(data.activity);
          loadWebsite(data?.activity?.activityUrl);
          setLoading(false);
        

          console.log("Update successful!", data);
        })
        .catch((error) => {
          console.error("Update failed", error);
        });
    });
  });
}
