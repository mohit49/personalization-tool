"use client";
var mode;
function initializeEditorPlugin() {
  const quillCSS = document.createElement("link");
  quillCSS.href =
    "https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css";
  quillCSS.rel = "stylesheet";
  document.head.appendChild(quillCSS);

  // Load Quill JS dynamically
  const quillScript = document.createElement("script");
  quillScript.src = "https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js";
  quillScript.onload = () => {
    // Initialize Quill after script loads
    console.log("rich Text Editor Loaded");
  };
  document.body.appendChild(quillScript);

  const htmlEdit = document.createElement("script");
  htmlEdit.src =
    " https://unpkg.com/quill-html-edit-button@2.2.7/dist/quill.htmlEditButton.min.js";
  htmlEdit.onload = () => {
    // Initialize Quill after script loads
    console.log("rich Text Editor Loaded");
  };
  document.body.appendChild(htmlEdit);
}
function exicutePrezy() {
  const quillCSS = document.createElement("link");
  quillCSS.href =
    "https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css";
  quillCSS.rel = "stylesheet";
  document.head.appendChild(quillCSS);
  const common = document.createElement("link");
  const mathRandomNumberFourDigit = Math.floor(
    Math.random() * (9999 - 1000 + 1) + 1000
  );
  common.href = `https://app.mazzl.ae/static/uploads/common.css?cacheBurst=${mathRandomNumberFourDigit}`;
  common.rel = "stylesheet";
  document.head.appendChild(common);

  var defaultStyle = document.createElement("style");
  defaultStyle.innerHTML = `
  .dropable-div {
  text-align:center;
  background:#eeeeee;
  border:1px #cccccc solid;
  pointer-events:none !important;
  }



    .dropable-div h4 {
    color:#cccccc;
    }

    .editor-div .highlighted , .editor-div  {

        outline: none !important;
        background-color:transparent !important;
      
    }
        .dropable-div.hide {
        display:none !important;
        }
  `;
  if (mode == "editor") {
    document.body.appendChild(defaultStyle);
    document.body.style.paddingBottom = "70px";

    var defaultStyle2 = document.createElement("style");
    defaultStyle2.innerHTML = `
    .prezify-editable span{
    cursor :pointer;
    }

      .prezify-editable div {
      display:flex;
      justizy-content:space-between;
    }
    `;
    document.body.appendChild(defaultStyle2);
  }
  const injectScript = (data, ele) => {
    var scriptTag = document.createElement("script");
    scriptTag.id = ele._id;

    var coloumn = `<div class="dropable-div">
    <h4>Drag and drop your Content Here</h4>
    </div>`;

    if (ele?.type == "html-modified") {
      // Add a script content to change text based on the selector
      scriptTag.innerHTML = `
        var element = document.querySelector('${ele.selector}');
        if (element) {
        debugger;
            var newDiv = document.createElement('div');
            newDiv.setAttribute('data-id', '${ele._id}');
            newDiv.innerHTML = \`${ele.newText}\`;
          const dropable = element.querySelector(".dropable-div");
        if(element.querySelector(".dropable-div")) {
        element.insertBefore(newDiv, dropable);
        } else {
           element.appendChild(newDiv);
         }
        
        }
      `;
    }

    if (ele?.type == "inserted-before") {
      scriptTag.innerHTML = `
          var element = document.querySelector('${ele.selector}');
          if (element && element.parentNode) {
              var newElement = document.createElement('div');
            newElement.innerHTML = \`${
              mode == "editor"
                ? ele.newText.replace("New Element Inserted", coloumn)
                : ele.newText
            }\`;
              element.parentNode.insertBefore(newElement, element);
          }
      `;
    }

    if (ele?.type === "inserted-after") {
      scriptTag.innerHTML = `
          var element = document.querySelector('${ele.selector}');
          if (element && element.parentNode) {
              var newElement = document.createElement('div');
                 newElement.innerHTML = \`${
                   mode == "editor"
                     ? ele.newText.replace("New Element Inserted", coloumn)
                     : ele.newText
                 }\`;
              element.parentNode.insertBefore(newElement, element.nextSibling);
          }
      `;
    }

    if (ele?.type === "container-added") {
      const columns = ele.settings.coloumns;

      // Determine how many columns to create
      const columnCountMap = {
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
      };

      const columnCount = columnCountMap[columns] || 1;

      // Generate column divs as HTML
      let columnDivs = "";
      for (let i = 0; i < columnCount; i++) {
        columnDivs += `<div  id="${
          "personalized-element-" + mathRandomNumberFourDigit
        }" class="column column-${i + 1}">${coloumn}</div>\n`;
      }

      // Build the script content
      scriptTag.innerHTML = `
        var element = document.querySelector('${ele.selector}');
        if (element) {
          element.innerHTML = \`<div class="${ele.settings.display} ${ele.settings.align} ${ele.settings.justify}  ${ele.settings.directions}" style=" gap: ${ele.settings.gap}">${columnDivs}</div>\`;
        }
      `;
    }

    if (ele?.type === "text-editor") {
      scriptTag.innerHTML = `
      var element = document.querySelector('${ele.selector}');
      if (element) {
       
             element.innerHTML = \`${ele.newText}\`;
          
      }
  `;
    }
    if (ele?.type === "modal-added") {
      const modalId = "personalized-element-" + ele._id,
        modalContainer = ele.selector,
        modalName = ele.newText,
        modalClass = ele.settings.containerClass || "modal",
        buttonId = ele.settings.buttonId,
        buttonName = ele.settings.buttonName,
        customCOde = ele.settings.customCode,
        popDelay =
          (ele.settings.delayMs?.length > 0 ? ele.settings.delayMs : "0") || 0,
        initializeOnLoad = ele.settings.initializeOnLoad,
        inputOnElementExist = ele.settings.inputOnElementExist,
        popMaxHeight = ele.settings.maxHeight,
        popMaxWidth = ele.settings.maxWidth,
        minHeight = ele.settings.minHeight,
        minWidth = ele.settings.minWidth,
        overlayBg = ele.settings.overlayBg,
        modalClassMutatid = modalClass.split(" "),
        popBg = ele.settings.backGroundColor;

      const popDiv = document.createElement("DIV"),
        popDivInner = document.createElement("DIV"),
        backDrop = document.createElement("DIV"),
        closeIcon = document.createElement("span"),
        classes = [
          "prezify-popup",
          "prezify-shadow",
          ...modalClassMutatid,
          "hide",
          !(mode == "editor") ? ele?.settings?.position : "NO-POSITION",
          !(mode == "editor")
            ? ele?.settings?.animate
              ? "animate"
              : "no-animate"
            : "no-animate",
        ];
      closeIcon.classList.add("prezify-close-icon");
      closeIcon.innerHTML = `&times;`;

      popDiv.classList.add(...classes);
      (backDrop.id = "backDrop-" + ele._id),
        backDrop.classList.add("prezify-modal-backdrop");
      popDivInner.id = modalId;

      popDiv.appendChild(popDivInner);
      popDiv.append(closeIcon);
      document.querySelector(modalContainer).appendChild(popDiv);
      if (ele.settings.showCustomCodeCss) {
        const style = document.createElement("style");
        style.textContent = ele.settings.customCodeCss;
        style.type = "text/css";
        document.head.appendChild(style);
      }
      if (ele.settings.showCustomCodeHtml) {
        const eleMen = document.createElement("div");
        eleMen.innerHTML = ele.settings.customCodeHtml;
        eleMen.classList.add("prezify-custom-html");
        popDivInner.appendChild(eleMen);
      }
      if (ele.settings.backDrop) {
        document.querySelector(modalContainer).appendChild(backDrop);
      }

      backDrop.classList.add("hide");
      (popDiv.dataset.modelId = ele._id),
        Object.assign(popDiv.style, {
          backgroundColor: popBg,
          maxWidth: popMaxWidth,
          padding: "0px",
          margin: "0 auto",
          fontSize: "24px",
          textAlign: "center",
          maxHeight: popMaxHeight,
          borderRadius: "10px",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
        });

      closeIcon.addEventListener("click", function () {
        popDiv.classList.add("hide");
        backDrop.classList.add("hide");
      });

      if (ele?.settings?.initializeOnLoad) {
        setTimeout(() => {
          popDiv.classList.remove("hide");
          backDrop.classList.remove("hide");
        }, popDelay);
      }
      if (ele?.settings?.exitIntent) {
        function showPopupMain() {
          popDiv.classList.remove("hide");
          backDrop.classList.remove("hide");
        }
        const SHOW_DELAY_HOURS = ele?.settings?.cookiesHours; // 12 or 24
        const INACTIVITY_TIMEOUT = ele?.settings?.inactiveDelay; // in seconds — set to 0 or undefined to disable inactivity
        const ENABLE_EXIT_INTENT = true; // set to false to disable exit intent
        const COOKIE_NAME = "exitIntentShown_" + ele._id;

        let inactivityTimer = null;
        let popupShown = false;

        function setCookie(name, value, hours) {
          const d = new Date();
          d.setTime(d.getTime() + hours * 60 * 60 * 1000);
          document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
        }

        function getCookie(name) {
          const cookies = document.cookie.split(";");
          for (let c of cookies) {
            const [key, value] = c.trim().split("=");
            if (key === name) return value;
          }
          return null;
        }

        function showPopup() {
          if (popupShown || getCookie(COOKIE_NAME)) return;
          showPopupMain();
          popupShown = true;
          setCookie(COOKIE_NAME, "true", SHOW_DELAY_HOURS);
        }

        // Conditional: Exit Intent
        if (ENABLE_EXIT_INTENT) {
          document.addEventListener("mouseout", function (e) {
            if (e.clientY < 50) {
              showPopup();
            }
          });
        }

        // Conditional: Inactivity Detection
        if (
          typeof INACTIVITY_TIMEOUT !== "undefined" &&
          INACTIVITY_TIMEOUT > 0
        ) {
          function resetInactivityTimer() {
            if (getCookie(COOKIE_NAME)) return;

            if (inactivityTimer) clearTimeout(inactivityTimer);

            inactivityTimer = setTimeout(() => {
              showPopup();
            }, INACTIVITY_TIMEOUT * 1000);
          }

          function initInactivityDetection() {
            const events = ["mousemove", "keydown", "touchstart", "scroll"];
            events.forEach((evt) =>
              window.addEventListener(evt, resetInactivityTimer, {
                passive: true,
              })
            );
            resetInactivityTimer();
          }

          if (!getCookie(COOKIE_NAME)) {
            initInactivityDetection();
          }
        }
      }

      if (ele?.settings?.inputOnElementExist) {
        const selector = ele?.settings?.inputOnElementExist;
        const isClass = selector?.startsWith(".");
        const isId = selector?.startsWith("#");
        const selectorName = selector?.slice(1); // remove . or #

        const targetElement = document.querySelector(selector);
        if (!targetElement) {
          const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
              if (mutation.type === "childList") {
                mutation.addedNodes.forEach((node) => {
                  if (node.nodeType === 1) {
                    // ELEMENT_NODE
                    // Check if new node matches class or ID
                    const isMatch = isClass
                      ? node.classList?.contains(selectorName)
                      : isId
                      ? node.id === selectorName
                      : false;

                    if (isMatch) {
                      popDiv.classList.remove("hide");
                      backDrop.classList.remove("hide");
                      return;
                    }

                    // Check inside newly added node
                    const matches = node.querySelectorAll?.(selector);
                    if (matches?.length > 0) {
                      popDiv.classList.remove("hide");
                      backDrop.classList.remove("hide");
                      if (!ele?.settings?.continueObserve) {
                        observer.disconnect(); // Stop observing once found
                      }
                    }
                  }
                });
              } else if (mutation.type === "attributes" && (isClass || isId)) {
                const target = mutation.target;
                const isAttrMatch = isClass
                  ? target.classList?.contains(selectorName)
                  : isId
                  ? target.id === selectorName
                  : false;

                if (isAttrMatch) {
                  popDiv.classList.remove("hide");
                  backDrop.classList.remove("hide");
                  if (!ele?.settings?.continueObserve) {
                    observer.disconnect(); // Stop observing once found
                  }
                }
              }
            }
          });

          observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: isClass ? ["class"] : isId ? ["id"] : [],
          });
        }

        if (ele.settings.showCustomCode) {
          const script = document.createElement("script");
          script.textContent = ele.settings.customCode;
          script.type = "text/javascript";
          // Append to the div
          popDivInner.appendChild(script);
        }
      }

      if (mode == "editor") {
        const activityId = window.location.href.split("/").pop();
        var currentActivity = false;
        if (activityId == data._id) {
          currentActivity = true;
        } else {
          popDiv.classList.add("non-configurable");
        }
        const headDiv = document.createElement("div");
        headDiv.classList.add("modal-heading");
        headDiv.classList.add("non-editable");
        popDiv.classList.add("non-editable");
        headDiv.innerHTML = `Modal ${modalName} ${
          currentActivity
            ? ""
            : `<span>Note : This modal is not belongs to this activity so you cannot edit this please check <b>${data.activityName}</b> activity to eidt this modal</span>`
        }`;
        Object.assign(headDiv.style, {
          backgroundColor: "#2c3e50",
          color: "#ffffff",
          padding: "10px",
          margin: "0px",
          fontSize: "24px",
          textAlign: "center",
          width: "100%",
        });

        Object.assign(popDiv.style, {
          backgroundColor: popBg,
          maxWidth: popMaxWidth,
          padding: "0px",
          margin: "0 auto",
          borderRadius: "10px",
        });

        popDiv.insertAdjacentHTML("beforebegin", headDiv.outerHTML);
        popDivInner.innerHTML = popDivInner.innerHTML + coloumn;
      } else {
        Object.assign(popDiv.style, {
          position: "fixed",

          zIndex: 1000,
        });
        Object.assign(backDrop.style, {
          position: "fixed",
          top: "50%",
          left: "50%",
          width: "100%",
          left: "0",
          top: "0",
          height: "100%",
          backgroundColor: overlayBg,
          zIndex: 999,
        });
      }
    }

    // Append the script tag to the body (or head) of the document
    document.body.appendChild(scriptTag);
  };
  const setActivity = (data) => {
    if (data?.htmlCode.length > 0) {
      data?.htmlCode.map((ele) => {
        injectScript(data, ele);
      });
    }
  };

  // Function to inject activities
  const injectActivities = async () => {
    try {
      const response = await fetch(
        `https://app.mazzl.ae/api/auth/project/${project.id}/activities/live`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json(); // parse JSON data from the response
      data?.activities.map((ele) => {
        setActivity(ele); // this will print the fetched activities to the console
      });

      // Do something with the data here (e.g., render activities to the UI)
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  // Page loaded event
  const exicutePageLoaded = () => {
    console.log("page-loaded-event-fired");
    injectActivities();
  };

  // Element observer event
  const exicuteElementOvbserve = () => {
    console.log("element-exist-event-fired");
    injectActivities();
  };

  // Variable observer event
  const exicuteVariableObserve = () => {
    console.log("variable-exist-event-fired");
    injectActivities();
  };

  // Construct the API URL dynamically using the project ID
  const apiUrl = `https://app.mazzl.ae/api/auth/launch-settings/${project.id}`;

  // Fetch data from the API
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parse the JSON from the response
    })
    .then((data) => {
      const events = data.settings;

      events.forEach((ele) => {
        if (ele.event == "page-loaded") {
          exicutePageLoaded();
        }

        if (ele.event == "element-exist") {
          // Check if the selector exists in the DOM
          const selector = ele.element; // Assume `ele.element` is the CSS selector provided in the event data
          observeElementExist(selector);
        }

        if (ele.event == "variable-exists") {
          // Observe the variable or object changes

          const variableName = ele.variable; // e.g., project, or a specific property to watch

          const descriptor = Object.getOwnPropertyDescriptor(
            window,
            variableName
          );
          if (descriptor && descriptor.configurable) {
            let value = window[variableName]; // Get the current value of the global variable

            // Define getter and setter to observe changes
            Object.defineProperty(window, variableName, {
              get() {
                return value;
              },
              set(newValue) {
                // Trigger the function when the variable changes
                console.log(
                  `${variableName} changed from ${value} to ${newValue}`
                );

                // Call your custom function here
                exicuteVariableObserve(newValue);

                // Update the value
                value = newValue;
              },
              configurable: true,
            });
          }
        }
      });
    });

  // Function to observe the element and check its existence
  function observeElementExist(selector) {
    const element = document.querySelector(selector);
    if (element) {
      exicuteElementOvbserve();
    } else {
      console.log(`Element ${selector} does not exist in the DOM.`);
    }

    // Optionally, observe DOM changes using MutationObserver if the element might be dynamically added later
    const config = { childList: true, subtree: true };

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`Element ${selector} Found`);
        exicuteElementOvbserve();
      } else {
        console.log(`Element ${selector} does not exist in the DOM.`);
      }
    });

    // Start observing the DOM for changes (can be restricted to specific parent element if needed)
    observer.observe(document.body, config);
  }

  console.log("Project Details:", project);
  // Add any other logic or functionality you want in the JS file

  console.log("Project Details:", project);
  // Add any other logic or functionality you want in the JS file
}
window.parent.addEventListener("VecRender", function () {
  if (window.location.host.includes("app.mazzl.ae")) {
    mode = "editor";
    initializeEditorPlugin();
    exicutePrezy();
  }
});

if (!window.location.host.includes("app.mazzl.ae")) {
  exicutePrezy();
}
