import { reloadPage } from "./utils";
import countryMap from "./data/apple-regions.json";
import appMap from "./data/apps.json";

const LOCAL_STORAGE_KEY = "state";
const INITIAL_COUNTRY_CODES = Object.keys(countryMap);

export function getDemoState() {
  function getState() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}");
  }

  function setStateAndReload(nextState) {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        ...getState(),
        ...nextState,
      })
    );

    reloadPage();
  }

  return {
    demoState: getState(),
    setDemoStateAndReload: setStateAndReload,

    startDemoAndReload() {
      setStateAndReload({
        isStarted: true,
        isValidatingBrowser: true,
        screenHeight: window.visualViewport.height,
      });
    },

    validateBrowserAndReload() {
      const searchScope = INITIAL_COUNTRY_CODES;

      setStateAndReload({
        isValidatingBrowser: false,
        isBrowserSupported: true,
        isDetecting: true,
        searchScope,
        nextAppId: findAppCandidate(searchScope),
        exclude: [],
      });
    },

    setTestResult(isSuccessful) {
      const demoState = getState();
      const appId = demoState.nextAppId;
      const exclude = [...demoState.exclude, appId];

      const appScope = appMap[appId].countries;
      const searchScope = isSuccessful
        ? appScope.filter((it) => demoState.searchScope.includes(it))
        : demoState.searchScope.filter((it) => !appScope.includes(it));

      const nextAppId = findAppCandidate(searchScope, exclude);
      const isFinished = !nextAppId || demoState.searchScope.length === 1;

      setStateAndReload({
        isDetecting: !!nextAppId && !isFinished,
        isFinished,
        exclude,
        searchScope,
        nextAppId,
      });
    },

    skipApp() {
      const demoState = getState();
      const appId = demoState.nextAppId;
      const exclude = [...demoState.exclude, appId];

      const nextAppId = findAppCandidate(demoState.searchScope, exclude);

      setStateAndReload({
        isDetecting: !!nextAppId,
        isFinished: !nextAppId,
        exclude,
        nextAppId,
      });
    },

    resetDemoAndReload() {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      reloadPage();
    },
  };
}

function findAppCandidate(searchScope, excludeApps = []) {
  const appByScore = scoreAppByCountries(searchScope);
  const target = Math.ceil(searchScope.length / 2);

  let maxScore = Infinity;
  let maxAppId = 0;

  appByScore.forEach((value, appId) => {
    const score = Math.abs(target - value);
    if (!excludeApps.includes(appId) && score < maxScore) {
      maxScore = score;
      maxAppId = appId;
    }
  });

  return maxScore < target ? maxAppId : undefined;
}

function scoreAppByCountries(scope) {
  const appIds = Object.keys(appMap);
  const appByScore = new Map();

  for (const appId of appIds) {
    const appRegions = appMap[appId].countries;
    let score = 0;

    for (const country of appRegions) {
      if (scope.includes(country)) {
        score++;
      }
    }

    appByScore.set(appId, score);
  }

  return appByScore;
}
