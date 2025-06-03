import Cloudflare from 'cloudflare';

const client = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_API_KEY
});

export async function writeToKV(code: string, originalUrl: string, linkId: number) {
  const key = code;
  const payload = JSON.stringify({ originalUrl, linkId });
  const namespaceId = "7fdaccaf9072443db29e72b452dd8254";
  const accountId = "cedc684260ce5373e68f79a5fa17e2f3";

  try {
    const response = await client.put(`/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`,
      {
        // headers: { "Content-Type": "application/json" },
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: payload,
      }
    );

    console.log("KV write success:", response);
    return response;
  } catch (error: unknown) {
    console.error("Failed to write to KV", error);
    throw error;
  }

}

