import { readFileSync, writeFileSync } from "fs";
import { setTimeout } from "timers/promises";
import { parseAvailableRegionsForApp } from "./check-app-availability.mjs";

if (process.argv) {
  main();
}

async function main() {
  const appMap = JSON.parse(readFileSync("./result.json").toString());
  const appIds = Object.keys(appMap);

  for (const appId of appIds) {
    console.log("Parsing", appId);
    const regions = await parseAvailableRegionsForApp(appId);

    console.log(appId, regions.length, appMap[appId].countries.length);

    appMap[appId].countries = regions;

    writeFileSync("./result-validated.json", JSON.stringify(appMap, null, 2));

    await setTimeout(10000);
  }
}
