const browser = chrome || browser;
const [runtime, storage] = [browser.runtime, browser.storage.sync];
const config = { childList: true };

const styles = {
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

    .wp-container::before {
        color: var(--yt-spec-text-secondary);
        content: "-";
        padding: 0 4px;
    }
  `,
};

const addScript = (src) => {
  const script = document.createElement("script");
  script.src = runtime.getURL(src);
  script.id = "adashima-script";

  const observer = new MutationObserver((mutations, observer) => {
    if (document.body) {
      observer.disconnect();
      document.body.appendChild(script);
      console.log("Script Injected");
    }
  });
  observer.observe(document.documentElement, config);
};

const addStyles = (css) => {
  const style = document.createElement("style");
  style.type = "text/css";
  style.id = "adashima-style";
  style.textContent = css;
  document.documentElement.appendChild(style);
  console.log("CSS Injected");
};

const run = async () => {
  const { isEnabled } = await storage.get(["isEnabled"]);
  if (isEnabled) {
    addStyles(styles.duration);
    addScript("./scripts/main.js");
  }
};
run();
