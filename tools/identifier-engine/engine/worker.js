import whiskySystem from "../brands/whisky/system.js";
import boardgameSystem from "../brands/boardgame/system.js";
import whiskyData from "../brands/whisky/data.json" assert { type: "json" };
import boardgameData from "../brands/boardgame/data.json" assert { type: "json" };

const BRANDS = {
  whisky: { systemPrompt: whiskySystem, data: whiskyData },
  boardgame: { systemPrompt: boardgameSystem, data: boardgameData },
};

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODELS = {
  best: "claude-opus-4-7",
  cheap: "claude-sonnet-4-6",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({ ok: true, brands: Object.keys(BRANDS) });
    }

    if (url.pathname !== "/scan") {
      return new Response("Not found", { status: 404 });
    }
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    if (request.headers.get("x-identifier-key") !== env.IDENTIFIER_KEY) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const brand = BRANDS[body.brand];
    if (!brand) {
      return Response.json({ error: "unknown brand" }, { status: 400 });
    }
    if (!body.image) {
      return Response.json({ error: "image required" }, { status: 400 });
    }

    const model = MODELS[body.tier] ?? MODELS.best;
    const identification = await identify(env.ANTHROPIC_API_KEY, model, brand.systemPrompt, body.image);
    const enriched = enrich(identification, brand.data, body.brand);

    return Response.json(enriched);
  },
};

async function identify(apiKey, model, systemPrompt, image) {
  const imageBlock = image.startsWith("http")
    ? { type: "image", source: { type: "url", url: image } }
    : { type: "image", source: { type: "base64", media_type: "image/jpeg", data: image } };

  const response = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: [imageBlock, { type: "text", text: "Identify this." }] }],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Anthropic ${response.status}: ${text}`);
  }

  const json = await response.json();
  const text = json.content?.[0]?.text ?? "";

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return { raw: text, parseError: true };
  try {
    return JSON.parse(match[0]);
  } catch {
    return { raw: text, parseError: true };
  }
}

function enrich(identification, data, brand) {
  if (brand === "whisky" && identification.distillery) {
    const key = identification.distillery.toLowerCase().trim();
    const hit = data.distilleries.find((d) => d.name.toLowerCase() === key);
    if (hit) identification.distillery_info = hit;
  }
  if (brand === "boardgame" && Array.isArray(identification.candidates)) {
    identification.candidates = identification.candidates.map((c) => {
      const hit = data.games.find((g) => g.name.toLowerCase() === c.game?.toLowerCase());
      return hit ? { ...c, game_info: hit } : c;
    });
  }
  return identification;
}
