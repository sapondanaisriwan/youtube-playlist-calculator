// ==UserScript==
// @name        YouTube Playlist Calculator
// @version     1.0.0
// @author      sapondanaisriwan
// @namespace   https://github.com/sapondanaisriwan/Youtube-Playlist-Calculator
// @description Get the total length/duration of a YouTube playlist.
// @match       https://www.youtube.com/*
// @grant       none
// @license     MIT
// @homepageURL https://github.com/sapondanaisriwan/Youtube-Playlist-Calculator
// @updateURL   https://github.com/sapondanaisriwan/Youtube-Playlist-Calculator/raw/main/yt-playlist-calculator.user.js
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

const cLogStyles = "color: red; font-size: 16px";
const config = { childList: true, subtree: true };

const selectors = {
  overlayTime: "ytd-playlist-header-renderer #overlays .duration-text",
  playlistOverlay: "ytd-playlist-header-renderer #overlays",
  timestampOverlay:
    "ytd-playlist-video-list-renderer #text.ytd-thumbnail-overlay-time-status-renderer",
  thumbnail:
    "ytd-playlist-video-list-renderer ytd-thumbnail-overlay-hover-text-renderer",
};

const overlayDurationEle = document.createElement("div");
overlayDurationEle.setAttribute("class", "duration-overlay");

const overlayText = document.createElement("span");
overlayText.setAttribute("class", "duration-text");

overlayDurationEle.appendChild(overlayText);

const cLog = (msg) => console.log(`%c${msg}`, cLogStyles);

const select = (selector) => document.querySelector(selector);

const selectAll = (selector) => document.querySelectorAll(selector);

const addStyles = (css) => {
  const style = document.createElement("style");
  style.type = "text/css";
  style.textContent = css;
  document.documentElement.appendChild(style);
};

const findSumOfSecond = (overlays) => {
  let totalSeconds = 0;
  overlays.forEach((overlay) => {
    const timeArr = overlay.innerText.split(":").map(Number);

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

const formatDuration = (sumSeconds) => {
  const hours = Math.floor(sumSeconds / 3600);
  const minutes = Math.floor((sumSeconds % 3600) / 60);
  const seconds = sumSeconds % 60;
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

const createElement = (duration) => {
  const overlayTimeEle = select(selectors.overlayTime);
  const overlayCon = select(selectors.playlistOverlay);

  if (!overlayCon) return;

  if (overlayTimeEle) {
    overlayTimeEle.textContent = duration;
  } else {
    overlayCon.prepend(overlayDurationEle);
  }
};

const test = () => {
  if (window.location.pathname !== "/playlist") return;
  const getOverlayElements = selectAll(selectors.timestampOverlay);
  const sumSeconds = findSumOfSecond(getOverlayElements);
  const duration = formatDuration(sumSeconds);
  createElement(duration);
};

const run = () => {
  addStyles(`
    .duration-overlay {
      margin: 4px;
      display: inline-block;
      position: absolute;
      bottom: 0;
      right: 0;
      margin: 4px;
      color: var(--yt-spec-static-brand-white);
      background-color: var(--yt-spec-static-overlay-background-heavy);
      padding: 3px 4px;
      height: 12px;
      border-radius: 2px;
      font-size: var(--yt-badge-font-size,1.2rem);
      font-weight: var(--yt-badge-font-weight,500);
      line-height: var(--yt-badge-line-height-size,1.2rem);
      letter-spacing: var(--yt-badge-letter-spacing,unset);
      letter-spacing: var(--yt-badge-letter-spacing,0.5px);
      display: flexbox;
      display: flex;
      flex-direction: row;
      align-items: center;
      display: inline-flexbox;
      display: inline-flex;
    }
    .duration-text {
        max-height: 1.2rem;
        overflow: hidden;
    }
  `);
  const observer = new MutationObserver(test);
  observer.observe(document.body, config);
};

run();
