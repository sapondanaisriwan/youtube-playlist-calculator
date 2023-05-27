const youtubeURL = "https://www.youtube.com/*";
const browser = chrome || browser;
const [runtime, storage] = [browser.runtime, browser.storage.sync];

const setting = { isEnabled: true };

runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install" || reason === "update") {
    storage.set(setting);
    reloadTabs();
  }
});

const fetchTabs = () => browser.tabs.query({ url: youtubeURL });

const reloadTabs = async () => {
  const tabs = await fetchTabs();
  tabs.forEach((tab) => browser.tabs.reload(tab.id));
};
