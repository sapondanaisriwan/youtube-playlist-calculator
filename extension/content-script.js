const browser = chrome || browser;
const [runtime, storage] = [browser.runtime, browser.storage.sync];

const addScript = (src) => {
  const scriptElement = document.createElement("script");
  scriptElement.src = chrome.runtime.getURL(src);
  document.body.appendChild(scriptElement);
};

const run = async () => {
  const { isEnabled } = await storage.get(["isEnabled"]);
  if (isEnabled) addScript("./scripts/main.js");
};
run();
