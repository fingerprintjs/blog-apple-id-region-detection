import { readFileSync, writeFileSync } from "fs";
import { setTimeout } from "timers/promises";
import async from "async";
import fetch from "node-fetch";

const asyncLimit = 1;
const countryMap = JSON.parse(
  readFileSync("./data/apple-regions.json").toString()
);

if (process.argv) {
  main();
}

async function main() {
  const appMap = JSON.parse(
    readFileSync("./result-validated-2.json").toString()
  );
  const appIds = Object.keys(appMap);
  let i = 0;

  appIds.splice(0, 17 + 62 + 28 + 15 + 2 + 7);
  for (const appId of appIds) {
    i++;

    console.log(`Parsing (${i}/${appIds.length}): ${appId}`);
    const regions = await parseAvailableRegionsForApp(appId);

    console.log(appId, regions.length, appMap[appId].countries.length);

    appMap[appId].countries = regions;

    writeFileSync("./result-validated-2.json", JSON.stringify(appMap, null, 2));

    await setTimeout(5000);
  }
}

export async function parseAvailableRegionsForApp(appId) {
  const countryCodes = Object.keys(countryMap);
  const countriesAvailable = [];
  const countriesRestricted = [];

  await async.eachLimit(countryCodes, asyncLimit, async (countryCode) => {
    const result = await checkAppAvailabilityForRegion(appId, countryCode);

    if (result) {
      countriesAvailable.push(countryCode);
    } else {
      countriesRestricted.push(countryCode);
    }
  });

  return countriesAvailable;
}

export async function checkAppAvailabilityForRegion(appId, countryCode) {
  return fetch(`https://itunes.apple.com/${countryCode}/lookup?id=${appId}`)
    .then((response) => response.json())
    .then((json) => {
      if (json.resultCount === 0) {
        return false;
      } else {
        return true;
      }
    });
}
