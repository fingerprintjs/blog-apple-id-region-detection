import fetch from "node-fetch";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import async from "async";
import { setTimeout } from "timers/promises";

const asyncLimit = 1;
const countryMap = JSON.parse(
  readFileSync("./data/apple-regions.json").toString()
);

yargs(hideBin(process.argv))
  .command(
    "check <appId>",
    "Parse available regions by app ID",

    (args) =>
      args.positional("appId", {
        describe: "App ID",
        type: "number",
        demandOption: true,
      }),

    async (args) => {
      const appId = args.appId;
      const metadata = await parseAvailableRegionsForApp(appId);

      console.log(JSON.stringify(metadata, null, 2));
    }
  )
  .parseAsync();

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

export async function checkAppAvailabilityForRegion(
  appId,
  countryCode,
  retry = 0,
  e = null
) {
  if (retry === 2) {
    throw e;
  }

  return fetch(`https://itunes.apple.com/${countryCode}/lookup?id=${appId}`)
    .then((response) => response.json())
    .then((json) => {
      if (json.resultCount === 0) {
        return false;
      } else {
        return true;
      }
    })
    .catch((e) =>
      setTimeout(2000).then(() =>
        checkAppAvailabilityForRegion(appId, countryCode, retry + 1, e)
      )
    );
}
