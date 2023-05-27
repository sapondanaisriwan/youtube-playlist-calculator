const addScript = (src) => {
  const scriptElement = document.createElement("script");
  scriptElement.src = chrome.runtime.getURL(src);
  document.body.appendChild(scriptElement);
};
addScript("./scripts/main.js");