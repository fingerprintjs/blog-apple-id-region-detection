import fetch from "node-fetch";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

yargs(hideBin(process.argv))
  .command(
    "parse <appId>",
    "Parse available regions by app ID",

    (args) =>
      args.positional("appId", {
        describe: "App ID",
        type: "number",
        demandOption: true,
      }),

    async (args) => {
      const appId = args.appId;
      const metadata = await getAppMetadata(appId);

      const output = {
        [appId]: {
          countries: metadata.valid_countries,
        },
      };

      console.log(JSON.stringify(output, null, 2));
    }
  )
  .parseAsync();

export async function getAppMetadata(appId) {
  return fetch(`https://app.sensortower.com/api/ios/apps/${appId}`).then(
    (response) => response.json()
  );
}
