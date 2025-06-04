import Cloudflare from 'cloudflare';

const client = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_API_KEY
});

const namespaceId = process.env.CLOUDFLARE_KV_NAMESPACE_ID;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

export async function writeToKV(code: string, originalUrl: string, linkId: number) {
  console.log("client", client)
  const keyName = code;
  const payload = { originalUrl, linkId };
  try {
    await client.put(`/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${keyName}`, { body: payload });
  } catch (error: unknown) {
    console.error("Failed to write to KV", error);
    throw error;
  }
}

