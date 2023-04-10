import { readFileSync, writeFileSync } from "fs";
import { setTimeout } from "timers/promises";
import { parseAvailableRegionsForApp } from "./check-app-availability.mjs";

if (process.argv) {
  main();
}

async function main() {
  const countryMap = JSON.parse(
    readFileSync("./data/apple-regions.json").toString()
  );
  const svg = readFileSync("./assets/world.svg").toString();

  const countryNames = Object.values(countryMap);

  for (const countryName of countryNames) {
    if (
      !svg.includes(`class="${countryName}"`) &&
      !svg.includes(`name="${countryName}"`)
    ) {
      console.log("missing", countryName);
    }
  }
}
