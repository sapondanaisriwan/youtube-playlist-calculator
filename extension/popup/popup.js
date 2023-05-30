const youtubeURL = "https://www.youtube.com/*";
const browser = chrome || browser;
const [runtime, storage] = [browser.runtime, browser.storage.sync];

const buttonEle = document.querySelector("button");

const init = async () => {
  const { isEnabled } = await storage.get(["isEnabled"]);
  buttonEle.setAttribute("aria-pressed", isEnabled);
};

init();

const fetchTabs = () => browser.tabs.query({ url: youtubeURL });

const reloadTabs = async () => {
  const tabs = await fetchTabs();
  tabs.forEach((tab) => browser.tabs.reload(tab.id));
};

buttonEle.addEventListener("click", (e) => {
  const button = e.target.parentElement;
  storage.set({ isEnabled: button.ariaPressed == "true" ? false : true });
  button.setAttribute(
    "aria-pressed",
    button.ariaPressed == "true" ? false : true
  );
  reloadTabs();
});
