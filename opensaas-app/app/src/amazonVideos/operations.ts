import { HttpError, env } from "wasp/server";
import type { GetAmazonVideos } from "wasp/server/operations";

export type AmazonVideo = {
  position: number;
  title: string;
  link: string;
  thumbnail: string;
  duration: string;
  vendor: string;
  vendor_thumbnail: string;
  date: string;
};

const ASIN_RE = /^[A-Z0-9]{10}$/;

export const getAmazonVideos: GetAmazonVideos<{ asin: string }, AmazonVideo[]> =
  async ({ asin }) => {
    if (!ASIN_RE.test(asin)) {
      throw new HttpError(400, "ASIN must be a 10-character alphanumeric string");
    }
    if (!env.SERPAPI_API_KEY) {
      throw new HttpError(500, "SERPAPI_API_KEY is not configured on the server");
    }

    const url = new URL("https://serpapi.com/search.json");
    url.searchParams.set("engine", "amazon_product");
    url.searchParams.set("asin", asin);
    url.searchParams.set("api_key", env.SERPAPI_API_KEY);

    const resp = await fetch(url);
    if (!resp.ok) {
      throw new HttpError(resp.status, `SerpApi request failed: ${resp.statusText}`);
    }
    const payload = (await resp.json()) as { videos?: AmazonVideo[] };
    return payload.videos ?? [];
  };
