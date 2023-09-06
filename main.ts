/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { SlackAPI } from "https://deno.land/x/deno_slack_api@2.1.1/mod.ts";
import "$std/dotenv/load.ts";

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";

const kv = await Deno.openKv();

const token = Deno.env.get("SLACK_BOT_TOKEN") as string;
const slackAPI = SlackAPI(token);

kv.listenQueue(async (msg) => {
  const channel = msg.channel;
  const text = msg.text;
  await postToChannel(channel, text);
});

async function postToChannel(channel: string, text: string): Promise<boolean> {
  const res = await slackAPI.chat.postMessage({
    channel,
    text,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text,
        },
      },
    ],
  });
  return res.ok;
}

await start(manifest, { plugins: [twindPlugin(twindConfig)] });
