import { Handlers, PageProps } from "$fresh/server.ts";
import { SlackAPI } from "https://deno.land/x/deno_slack_api@2.1.1/mod.ts";

const kv = await Deno.openKv();

const token = Deno.env.get("SLACK_BOT_TOKEN") as string;
const slackAPI = SlackAPI(token);

kv.listenQueue(async (msg) => {
  const channel = msg.channel;
  const text = msg.text;
  const res = await postToChannel(channel, text);
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
  return res;
}

export const handler: Handlers = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const text = url.searchParams.get("text");
    const channel = url.searchParams.get("channel");
    const delay = Number(url.searchParams.get("delay")) * 1000;
    await kv.enqueue({ text, channel }, { delay });
    return ctx.render({});
  },
};

export default function Page({ data }: PageProps) {
  return (
    <div>
      <form
        style={{
          textAlign: "center",
          maxWidth: "400px",
          margin: "0 auto",
          padding: "20px",
          background: "#fff",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: "5px",
        }}
      >
        <h1 style={{ color: "#007bff", marginBottom: "20px" }}>
          Set a Reminder
        </h1>
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="text"
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Text:
          </label>
          <input
            type="text"
            id="text"
            name="text"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "3px",
              fontSize: "16px",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="channel"
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Channel ID:
          </label>
          <input
            type="text"
            id="channel"
            name="channel"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "3px",
              fontSize: "16px",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="delay"
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Delay (in seconds):
          </label>
          <input
            type="number"
            id="delay"
            name="delay"
            value="0"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "3px",
              fontSize: "16px",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "3px",
            fontSize: "18px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          Remind
        </button>
      </form>
    </div>
  );
}
