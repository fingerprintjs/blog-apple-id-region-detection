import { useCallback, useEffect, useMemo } from "react";
import { Home } from "./components/Home/Home";
import { InProgress } from "./components/InProgress/InProgress";
import { Result } from "./components/Result/Result";
import {
  Unsupported,
  UnsupportedMode,
} from "./components/Unsupported/Unsupported";
import "./index.css";
import { getDemoState } from "./state";
import {
  isMobileSafari,
  renderSmartAppBanner,
  useVisualViewportHeight,
} from "./utils";

const FACEBOOK_APP_ID = 284882215;

export default function App() {
  const isSupported = useMemo(() => isMobileSafari(), []);
  const { minHeight, currentHeight } = useVisualViewportHeight();

  const handleStartClick = useCallback(() => {
    const { startDemoAndReload } = getDemoState();
    startDemoAndReload();
  }, []);

  useEffect(() => {
    const { demoState, setDemoStateAndReload, setTestResult } = getDemoState();

    window.scrollTo(0, 0);

    if (demoState.isValidatingBrowser) {
      renderSmartAppBanner(FACEBOOK_APP_ID);

      setTimeout(() => {
        setDemoStateAndReload({
          isValidatingBrowser: false,
          isBrowserSupported: false,
        });
      }, 800);
    }

    if (demoState.isBrowserSupported && demoState.nextAppId) {
      renderSmartAppBanner(demoState.nextAppId);

      setTimeout(() => {
        if (demoState.screenHeight === window.visualViewport.height) {
          setTestResult(false);
        } else {
          setTestResult(true);
        }
      }, 3000);
    }
  }, []);

  useEffect(() => {
    const { demoState, validateBrowserAndReload, setTestResult } =
      getDemoState();

    if (demoState.isValidatingBrowser) {
      if (currentHeight < demoState.screenHeight) {
        validateBrowserAndReload();
      }
    }

    if (demoState.isDetecting) {
      if (minHeight < currentHeight) {
        setTestResult(false);
      }
    }
  }, [minHeight, currentHeight]);

  if (!isSupported) {
    return <Unsupported />;
  }

  const { demoState } = getDemoState();

  if (demoState.isValidatingBrowser) {
    return null;
  }

  if (
    demoState.isValidatingBrowser === false &&
    demoState.isBrowserSupported === false
  ) {
    return <UnsupportedMode />;
  }

  if (demoState.isBrowserSupported && demoState.isDetecting) {
    return <InProgress />;
  }

  if (demoState.isFinished) {
    return <Result />;
  }

  return <Home onStartClick={handleStartClick} />;
}
