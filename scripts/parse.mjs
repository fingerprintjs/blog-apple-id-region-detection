import { readFileSync, writeFileSync } from "fs";
import { setTimeout } from "timers/promises";
import { getAppMetadata } from "./app-metadata.mjs";
import { getCountryRanking } from "./country-ranking.mjs";

main();

async function main() {
  const output = {};
  const processed = new Set();

  const countryList = JSON.parse(
    readFileSync("./data/sensor-regions.json").toString()
  );

  countryList.reverse();

  for (const country of countryList) {
    const apps = await getCountryRanking(country);

    for (const appId of apps.free) {
      if (!processed.has(appId)) {
        processed.add(appId);

        const metadata = await getAppMetadata(appId);

        if (metadata.valid_countries.length < 53) {
          output[appId] = {
            name: metadata.name,
            countries: metadata.valid_countries,
          };

          writeFileSync("./result.json", JSON.stringify(output, null, 2));
        }

        console.log(metadata.name, metadata.valid_countries.length);

        await setTimeout(25000);
      } else {
        console.log("Skipping", appId);
      }
    }
  }
}
