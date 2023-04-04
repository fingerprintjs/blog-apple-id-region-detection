import { useEffect, useRef, useState } from "react";

export function isMobileSafari() {
  return isWebKit() && !isDesktopSafari();
}

export function reloadPage() {
  document.location.reload();
}

export function useVisualViewportHeight() {
  const startHeight = window.visualViewport.height;
  const currentHeightRef = useRef(startHeight);
  const minHeightRef = useRef(startHeight);
  const [currentHeight, setCurrentHeight] = useState(startHeight);
  const [minHeight, setMinHeight] = useState(startHeight);

  useEffect(() => {
    function handleResize() {
      const { height, scale } = window.visualViewport;

      if (scale !== 1) {
        alert("Please do not scale the page");
        return;
      }

      currentHeightRef.current = height;
      minHeightRef.current = height;

      setCurrentHeight(height);
      setMinHeight((minValue) => Math.min(minValue, height));
    }

    window.visualViewport.addEventListener("resize", handleResize);

    return () =>
      window.visualViewport.removeEventListener("resize", handleResize);
  }, []);

  return {
    startHeight,
    currentHeight,
    currentHeightRef,
    minHeight,
    minHeightRef,
  };
}

export function renderSmartAppBanner(appId) {
  const meta = document.createElement("meta");

  meta.name = "apple-itunes-app";
  meta.content = "app-id=" + appId;

  document.head.appendChild(meta);
}

function countTruthy(values) {
  return values.reduce((sum, value) => sum + (value ? 1 : 0), 0);
}

// Ref: https://github.com/fingerprintjs/fingerprintjs/blob/master/src/utils/browser.ts

function isWebKit() {
  return (
    countTruthy([
      "ApplePayError" in window,
      "CSSPrimitiveValue" in window,
      "Counter" in window,
      navigator.vendor.indexOf("Apple") === 0,
      "getStorageUpdates" in navigator,
      "WebKitMediaKeys" in window,
    ]) >= 4
  );
}

function isDesktopSafari() {
  return (
    countTruthy([
      "safari" in window,
      !("DeviceMotionEvent" in window),
      !("ongestureend" in window),
      !("standalone" in navigator),
    ]) >= 3
  );
}
