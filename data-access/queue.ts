import { ClickPayload } from "@/lib/zod/clicks";
import { Client } from "@upstash/qstash";

const client = new Client({ token: process.env.QSTASH_TOKEN });

const queue = client.queue({
  queueName: "doubly-pg-writes"
});

export async function enqueueClick(clickPayload: ClickPayload) {
  const url = `${process.env.APP_URL}/api/record-click`;
  // console.log(url)
  const result = await queue.enqueueJSON({
    url: url,
    body: clickPayload
  });

  return result.messageId;
}

