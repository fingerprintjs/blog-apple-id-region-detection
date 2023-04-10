import { readFileSync, writeFileSync } from "fs";
import fetch from "node-fetch";
import { setTimeout } from "timers/promises";
import { getAppMetadata } from "./app-metadata.mjs";

if (process.argv) {
  main();
}

async function main() {
  const apps = await search("Vodafone");
  const appList = apps.map((it) => it.app_id);
  const output = JSON.parse(readFileSync("./result-search.json").toString());

  for (const appId of appList) {
    if (output[appId]) {
      console.log("Skipping", appId);
      continue;
    }

    const metadata = await getAppMetadata(appId);

    if (metadata.valid_countries.length < 100) {
      output[appId] = {
        name: metadata.name,
        countries: metadata.valid_countries,
      };

      writeFileSync("./result-search.json", JSON.stringify(output, null, 2));
    }

    console.log(metadata.name, metadata.valid_countries.length);

    await setTimeout(20000);
  }
}

export async function search(term, limit = 50) {
  return fetch(
    `https://app.sensortower.com/api/autocomplete_search?entity_type=app&expand_entities=false&flags=false&limit=${limit}&mark_usage_disabled_apps=false&os=ios&term=${term}    `
  )
    .then((response) => response.json())
    .then((result) => result.data.entities);
}
