

function exicutePrezy() {
const injectScript = (ele) =>{
var scriptTag = document.createElement('script');
scriptTag.id = ele._id;
debugger;
if(ele?.type =="html-modified") {

// Add a script content to change text based on the selector

scriptTag.innerHTML = `

  var element = document.querySelector('${ele.selector}');
  if (element) {
    element.innerHTML = '${ele.newText}';
  }

`;
}  if(ele?.type =="inserted-before") {
scriptTag.innerHTML = `
    var element = document.querySelector('${ele.selector}');
    if (element && element.parentNode) {
        var newElement = document.createElement('div');
        newElement.innerHTML = \`${ele.newText}\`;
        element.parentNode.insertBefore(newElement, element);
    }
`;
}

if (ele?.type === "inserted-after") {
scriptTag.innerHTML = `
    var element = document.querySelector('${ele.selector}');
    if (element && element.parentNode) {
        var newElement = document.createElement('div');
        newElement.innerHTML = \`${ele.newText}\`;
        element.parentNode.insertBefore(newElement, element.nextSibling);
    }
`;
}


// Append the script tag to the body (or head) of the document
document.body.appendChild(scriptTag);
}
  const setActivity = (data)=> {
    if(data?.htmlCode.length > 0) {
      data?.htmlCode.map((ele)=>{
        injectScript(ele)
      })
    }
  }




// Function to inject activities
const injectActivities = async () => {
try {
  const response = await fetch(`https://app.mazzl.ae/api/auth/project/${project.id}/activities/live`);
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  const data = await response.json(); // parse JSON data from the response
  data?.activities.map((ele)=>{
    setActivity(ele) // this will print the fetched activities to the console
  })


  // Do something with the data here (e.g., render activities to the UI)
  
} catch (error) {
  console.error('There was a problem with the fetch operation:', error);
}
};


// Page loaded event
const exicutePageLoaded = (() => {
console.log("page-loaded-event-fired");
injectActivities();
});

// Element observer event
const exicuteElementOvbserve = (() => {
console.log("element-exist-event-fired");
injectActivities();
});

// Variable observer event
const exicuteVariableObserve = (() => {
console.log("variable-exist-event-fired");
injectActivities();
});

// Construct the API URL dynamically using the project ID
const apiUrl = `https://app.mazzl.ae/api/auth/launch-settings/${project.id}`;

// Fetch data from the API
fetch(apiUrl)
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();  // Parse the JSON from the response
})
.then(data => {
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

    

      const descriptor = Object.getOwnPropertyDescriptor(window, variableName);
      if (descriptor && descriptor.configurable) {
          let value = window[variableName]; // Get the current value of the global variable
      
          // Define getter and setter to observe changes
          Object.defineProperty(window, variableName, {
              get() {
                  return value;
              },
              set(newValue) {
                  // Trigger the function when the variable changes
                  console.log(`${variableName} changed from ${value} to ${newValue}`);
      
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
})

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
window.parent.VecRenderChanges = function () {
if(window.location.host.includes("app.mazzl.ae")) {
exicutePrezy()
}
}

if(!window.location.host.includes("app.mazzl.ae")) {
exicutePrezy()
}