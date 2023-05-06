// ==UserScript==
// @name        YouTube Playlist Calculator
// @version     1.0.1
// @author      sapondanaisriwan
// @description Get the total length/duration of a YouTube playlist.
// @match       https://www.youtube.com/*
// @grant       none
// @license     MIT
// @namespace   https://greasyfork.org/en/scripts/465609-youtube-playlist-calculator
// @homepageURL https://github.com/sapondanaisriwan/Youtube-Playlist-Calculator
// @supportURL  https://github.com/sapondanaisriwan/Youtube-Playlist-Calculator/issues
// @icon        https://i.imgur.com/I9uDrsq.png
// ==/UserScript==

/*
If you want to submit a bug or request a feature please report via github issue. Since I receive so many emails, I can't reply to them all.
Contact: sapondanaisriwan@gmail.com
Support me: https://ko-fi.com/sapondanaisriwan 
Support me: https://ko-fi.com/sapondanaisriwan
Support me: https://ko-fi.com/sapondanaisriwan
Support me: https://ko-fi.com/sapondanaisriwan
Support me: https://ko-fi.com/sapondanaisriwan
*/

"use strict";

const config = { childList: true, subtree: true };

const selectors = {
  playlistPage: "ytd-browse[page-subtype='playlist']",
  overlayTime: "ytd-playlist-header-renderer #overlays .duration-text",
  playlistOverlay: "ytd-playlist-header-renderer #overlays",
  timestampOverlay:
    "ytd-playlist-video-list-renderer #text.ytd-thumbnail-overlay-time-status-renderer",
  thumbnail:
    "ytd-playlist-video-list-renderer ytd-thumbnail-overlay-hover-text-renderer",
};

const styles = {
  log: "color: #fff; font-size: 16px;",
  duration: `
    .duration-overlay {
      margin: 4px;
      position: absolute;
      bottom: 0;
      right: 0;
      color: var(--yt-spec-static-brand-white);
      background-color: var(--yt-spec-static-overlay-background-heavy);
      padding: 3px 4px;
      height: 12px;
      border-radius: 2px;
      font-size: var(--yt-badge-font-size,1.2rem);
      font-weight: var(--yt-badge-font-weight,500);
      line-height: var(--yt-badge-line-height-size,1.2rem);
      letter-spacing: var(--yt-badge-letter-spacing,0.5px);
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .duration-text {
        max-height: 1.2rem;
        overflow: hidden;
    }
  `,
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

const getData = (selector) => {
  return selector?.__data?.data?.contents?.twoColumnBrowseResultsRenderer
    ?.tabs[0]?.tabRenderer?.content?.sectionListRenderer?.contents[0]
    ?.itemSectionRenderer?.contents[0]?.playlistVideoListRenderer?.contents;
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

  if (overlayTimeEle) {
    overlayTimeEle.textContent = duration;
  } else {
    overlayCon.prepend(newOverlayContainer);
  }
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

const main = () => {
  const playlistEle = select(selectors.playlistPage);
  if (!playlistEle) return;

  const data = getData(playlistEle);
  const sum = sumResult(data);

  const duration = formatDuration(sum);
  addDurationOverlay(duration);
};

const run = () => {
  addStyles(styles.duration);
  const observer = new MutationObserver(main);
  observer.observe(document.body, config);
};

run();