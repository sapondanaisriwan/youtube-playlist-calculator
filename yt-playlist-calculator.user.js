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
  timeStamp:
    "ytd-playlist-video-list-renderer #text.ytd-thumbnail-overlay-time-status-renderer",
};

const cLog = (msg) => console.log(`%c${msg}`, cLogStyles);

const select = (selector) => document.querySelector(selector);

const selectAll = (selector) => document.querySelectorAll(selector);

const yes = (elements) => {
  let totalSeconds = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  elements.forEach((timestamp) => {
    const parts = timestamp.innerText.split(":");

    // Convert the components to numbers and calculate the total number of seconds for this timestamp
    const numParts = parts.map((part) => parseInt(part));
    let timestampSeconds = 0;
    if (numParts.length === 3) {
      timestampSeconds = numParts[0] * 3600 + numParts[1] * 60 + numParts[2];
    } else if (numParts.length === 2) {
      timestampSeconds = numParts[0] * 60 + numParts[1];
    } else {
      timestampSeconds = numParts[0];
    }

    // Add the timestamp's seconds to the total
    totalSeconds += timestampSeconds;
  });

  // Convert the total number of seconds to components
  hours = Math.floor(totalSeconds / 3600);
  minutes = Math.floor((totalSeconds % 3600) / 60);
  seconds = totalSeconds % 60;

  // Format the components as a timestamp string
  const formattedTimestamp = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  // Output the formatted timestamp
  console.log(formattedTimestamp);
};

const test = () => {
  if (window.location.pathname !== "/playlist") return;
  const getOverlayElements = selectAll(selectors.timeStamp);
  getOverlayElements && yes(getOverlayElements);
};

const run = () => {
  const observer = new MutationObserver(test);
  observer.observe(document.body, config);
};

run();
