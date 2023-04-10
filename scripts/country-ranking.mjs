import fetch from "node-fetch";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

yargs(hideBin(process.argv))
  .command(
    "parse <country>",
    "Parse apps by country",

    (args) =>
      args.positional("country", {
        describe: "Country code",
        type: "string",
        demandOption: true,
      }),

    async (args) => {
      const country = args.country;
      const output = await getCountryRanking(country);

      console.log(JSON.stringify(output, null, 2));
    }
  )
  .parseAsync();

export async function getCountryRanking(country) {
  return fetch(
    `https://app.sensortower.com/api/ios/category_rankings?offset=0&limit=25&category=0&country=${country}&date=2023-01-26&device=iphone`
  )
    .then((response) => response.json())
    .then((result) => ({
      free: result.data.free.map((it) => it.app_id),
      grossing: result.data.grossing.map((it) => it.app_id),
      paid: result.data.paid.map((it) => it.app_id),
    }));
}
