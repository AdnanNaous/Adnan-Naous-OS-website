import { brainEntries } from "@/data/brain";
import { findBrainPrompt } from "@/data/brainPrompts";
import { readWishes, reserveWish } from "@/lib/brainWishes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store" };
const unavailable = () => Response.json({ error: "Ask My Brain is resting. Try again later." }, { status: 503, headers });
const invalidPrompt = () => Response.json({ error: "Choose one of the suggested questions." }, { status: 400, headers });

export async function GET(request: Request) {
  try {
    return Response.json(await readWishes(request), { headers });
  } catch {
    return unavailable();
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  try {
    if (!origin || new URL(origin).origin !== new URL(request.url).origin) throw new Error("Invalid origin");
  } catch {
    return Response.json({ error: "Request unavailable." }, { status: 403, headers });
  }
  if (!request.headers.get("content-type")?.startsWith("application/json") || Number(request.headers.get("content-length") || 0) > 256) {
    return invalidPrompt();
  }

  let promptId: string;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Missing body");
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 256) {
        await reader.cancel();
        throw new Error("Long body");
      }
      chunks.push(value);
    }
    const body: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks)));
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid body");
    const values = body as Record<string, unknown>;
    if (Object.keys(values).length !== 1 || typeof values.promptId !== "string" || values.promptId.length > 80) throw new Error("Invalid prompt");
    promptId = values.promptId;
  } catch {
    return invalidPrompt();
  }

  const prompt = findBrainPrompt(promptId);
  if (!prompt) return invalidPrompt();
  const source = brainEntries.find(entry => entry.id === prompt.sourceId);
  if (!source) return unavailable();

  try {
    const wish = await reserveWish(request, prompt.id);
    if (wish.status < 0) return Response.json({ error: "That question has already been asked recently.", remaining: wish.remaining, resetAt: wish.resetAt }, { status: 400, headers });
    if (wish.status === 0) return Response.json({ error: "No wishes left. Come back later.", remaining: 0, resetAt: wish.resetAt }, { status: 429, headers });

    return Response.json({ answer: prompt.answer, sources: [{ id: source.id, title: source.title }], remaining: wish.remaining, resetAt: wish.resetAt }, { headers });
  } catch {
    return unavailable();
  }
}
