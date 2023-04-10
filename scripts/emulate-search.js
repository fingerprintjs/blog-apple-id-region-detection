const { readFileSync, writeFileSync } = require("fs");

const appMap = JSON.parse(readFileSync("./data/applications.json").toString());

const countryMap = JSON.parse(
  readFileSync("./data/apple-regions.json").toString()
);

if (process.argv) {
  main();
}

async function main() {
  const countriesNotDetectable = {};

  for (const countryCode of Object.keys(countryMap)) {
    let searchScope = Object.keys(countryMap);
    const excludeApps = [];

    while ((nextAppId = findAppCandidate(searchScope, excludeApps))) {
      if (countryCode === "UG") {
        console.log("UG", nextAppId, searchScope.length);
      }
      const appScope = appMap[nextAppId].countries;

      if (appScope.includes(countryCode)) {
        searchScope = appScope.filter((it) => searchScope.includes(it));
      } else {
        searchScope = searchScope.filter((it) => !appScope.includes(it));
      }

      excludeApps.push(nextAppId);

      if (searchScope.length === 1) {
        break;
      }
    }

    if (searchScope.length !== 1) {
      countriesNotDetectable[countryCode] = searchScope.length;
    }
  }

  console.log(countriesNotDetectable);
  console.log("Total:", Object.keys(countriesNotDetectable).length);

  writeFileSync(
    "./data/undetectable-countries.json",
    JSON.stringify(countriesNotDetectable, null, 2)
  );
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
