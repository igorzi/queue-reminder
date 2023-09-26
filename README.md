Simple Slack reminder app using [Deno KV](https://deno.com/kv) queues and
[Fresh](https://fresh.deno.dev/)

## Install

Fork the repo. Then be sure to add the environmental variable
[`SLACK_BOT_TOKEN`](https://api.slack.com/authentication/token-types).

## Usage

Run the app with:

```
deno task start
```

If you go to localhost:8000 on your browser, you'll see a simple interface. Fill
in your message,
[Channel ID](https://www.wikihow.com/Find-a-Channel-ID-on-Slack-on-PC-or-Mac),
and delay in seconds:

![]()

Hit remind. When the time comes, you'll see your message in Slack:

![]()
