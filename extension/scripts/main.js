"use strict";

const config = { childList: true, subtree: true };

const selectors = {
  watchPage: "ytd-watch-flexy[playlist]:not([hidden])",
  wpPLContainer:
    "ytd-playlist-panel-renderer[collapsible] #publisher-container.ytd-playlist-panel-renderer",
  wpPLText:
    "ytd-playlist-panel-renderer[collapsible] #publisher-container.ytd-playlist-panel-renderer .wp-text",
  playlistPage: "ytd-browse[page-subtype='playlist']:not([hidden])",
  overlayTime: "ytd-playlist-header-renderer #overlays .duration-text",
  playlistOverlay: "ytd-playlist-header-renderer #overlays",
  timestampOverlay:
    "ytd-playlist-video-list-renderer #text.ytd-thumbnail-overlay-time-status-renderer",
  thumbnail:
    "ytd-playlist-video-list-renderer ytd-thumbnail-overlay-hover-text-renderer",
};

const styles = {
  log: "color: #fff; font-size: 16px;",
};

const cLog = (msg) => console.log(`%c${msg}`, styles.log);

const select = (selector) => document.querySelector(selector);

const selectAll = (selector) => document.querySelectorAll(selector);

const addStyles = (css) => {
  const style = document.createElement("style");
  style.type = "text/css";
  style.textContent = css;
  document.documentElement.appendChild(style);
};

const getDataPlaylist = (selector) => {
  return selector.__data.data.contents.twoColumnBrowseResultsRenderer.tabs[0]
    .tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer
    .contents[0].playlistVideoListRenderer.contents;
};

const getDataWatchPage = (selector) => {
  return selector.__data.playlistData.contents;
};

const formatDuration = (sum) => {
  const hours = Math.floor(sum / 3600);
  const minutes = Math.floor((sum % 3600) / 60);
  const seconds = sum % 60;
  let formattedDuration = "";
  if (hours > 0) {
    formattedDuration += hours + ":";
  }
  if (minutes < 10 && hours > 0) {
    formattedDuration += "0";
  }
  formattedDuration += minutes + ":";
  if (seconds < 10) {
    formattedDuration += "0";
  }
  formattedDuration += seconds;
  return formattedDuration;
};

const newOverlayContainer = document.createElement("div");
newOverlayContainer.setAttribute("class", "duration-overlay");

const newTextEle = document.createElement("span");
newTextEle.setAttribute("class", "duration-text");

newOverlayContainer.appendChild(newTextEle);

const addDurationOverlay = (duration) => {
  const overlayTimeEle = select(selectors.overlayTime);
  const overlayCon = select(selectors.playlistOverlay);

  if (!overlayCon) return;
  if (!overlayTimeEle) return overlayCon.prepend(newOverlayContainer);
  overlayTimeEle.textContent = duration;
};

const newWPContainer = document.createElement("div");
newWPContainer.setAttribute(
  "class",
  "wp-container index-message-wrapper style-scope ytd-playlist-panel-renderer"
);

const newWPText = document.createElement("span");
newWPText.setAttribute("class", "wp-text");

newWPContainer.appendChild(newWPText);

const addDurationWP = (duration) => {
  const wpDurationEle = select(selectors.wpPLText);
  const wpContainerEle = select(selectors.wpPLContainer);
  if (!wpContainerEle) return;
  if (!wpDurationEle) return wpContainerEle.appendChild(newWPContainer);
  wpDurationEle.textContent = `[ ${duration} ]`;
};

const sumResult = (data) =>
  data.reduce((pre, cur) => {
    return (
      pre +
      (!!cur.playlistVideoRenderer
        ? +cur.playlistVideoRenderer.lengthSeconds
        : 0)
    );
  }, 0);

const sumResultText = (overlays) => {
  let totalSeconds = 0;
  overlays.forEach((overlay) => {
    if (!overlay.playlistPanelVideoRenderer) return;
    const timeArr = overlay?.playlistPanelVideoRenderer?.lengthText?.simpleText
      .split(":")
      .map(Number);

    let timestampSeconds = 0;
    if (timeArr.length === 3) {
      timestampSeconds = timeArr[0] * 3600 + timeArr[1] * 60 + timeArr[2];
    } else if (timeArr.length === 2) {
      timestampSeconds = timeArr[0] * 60 + timeArr[1];
    } else {
      timestampSeconds = timeArr[0];
    }

    totalSeconds += timestampSeconds;
  });
  return totalSeconds;
};

const main = () => {
  const playlistEle = select(selectors.playlistPage);
  const watchPageEle = select(selectors.watchPage);
  if (playlistEle) {
    const data = getDataPlaylist(playlistEle);
    if (data) {
      const sum = sumResult(data);
      const duration = formatDuration(sum);
      addDurationOverlay(duration);
    }
  }
  if (watchPageEle) {
    const data = getDataWatchPage(watchPageEle);
    if (data) {
      const sum = sumResultText(data);
      const duration = formatDuration(sum);
      addDurationWP(duration);
    }
  }
};

const run = () => {
  const observer = new MutationObserver(main);
  observer.observe(document.body, config);
};

run();
