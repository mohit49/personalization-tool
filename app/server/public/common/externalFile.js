// Project data
const project = {
    id: "67b0c0d388aa5fe637fb7bf2",
    name: "mohitrr",
    domain: "bbbbb.com",
    imageURL: "/uploads/mohitrr/2025-02-15/logo/1739636938582-logo.svg",
    createdAt: "undefined"
  };



  
  // Function to inject activities
  const injectActivities = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NODE_API_URL}/api/auth/project/67b0c0d388aa5fe637fb7bf2/activities/live`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json(); // parse JSON data from the response
      console.log(data); // this will print the fetched activities to the console
  
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
  const apiUrl = `${process.env.NEXT_PUBLIC_NODE_API_URL}/api/auth/launch-settings/${project.id}`;
  
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
  

  