import { ClickPayload } from "@/lib/zod/clicks";
import { Client } from "@upstash/qstash";

const client = new Client({ token: process.env.QSTASH_TOKEN });

const queue = client.queue({
  queueName: "doubly-pg-writes"
});

export async function enqueueClick(clickPayload: ClickPayload) {
  const result = await queue.enqueueJSON({
    url: `${process.env.APP_URL}/api/record-click`,
    body: clickPayload
  });

  return result.messageId;
}

