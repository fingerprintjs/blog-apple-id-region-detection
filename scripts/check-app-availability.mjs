import fetch from "node-fetch";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import async from "async";
import { setTimeout } from "timers/promises";

const asyncLimit = 10;
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
  retry = 0
) {
  return fetch(`https://apps.apple.com/${countryCode}/app/test/id${appId}`)
    .then((response) => response.text())
    .then((text) => {
      if (!text.includes("375380948")) {
        if (retry >= 1) {
          debug(appId, countryCode, text);
        } else {
          // Probably a protection
          return setTimeout(5000).then(() =>
            checkAppAvailabilityForRegion(appId, countryCode, retry + 1)
          );
        }
      }

      return text.includes(appId);
    });
}

function debug(appId, region, text) {
  if (!existsSync(`./responses/${appId}`)) {
    mkdirSync(`./responses/${appId}`, { recursive: true });
  }
  writeFileSync(`./responses/${appId}/${region}.html`, text);
}
