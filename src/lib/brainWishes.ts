import { createHash, createHmac } from "node:crypto";
import { createClient } from "redis";

const limit = 3;
const globalLimit = 30;
const windowSeconds = 24 * 60 * 60;
const globalKey = "brain:wishes:v1:global";

const reserveScript = `
local visitor = tonumber(redis.call("GET", KEYS[1]) or "0")
local visitorTtl = redis.call("TTL", KEYS[1])
local total = tonumber(redis.call("GET", KEYS[3]) or "0")
local totalTtl = redis.call("TTL", KEYS[3])
if redis.call("EXISTS", KEYS[2]) == 1 then return {-1, visitor, visitorTtl, total, totalTtl} end
if visitor >= tonumber(ARGV[1]) or total >= tonumber(ARGV[2]) then return {0, visitor, visitorTtl, total, totalTtl} end
visitor = redis.call("INCR", KEYS[1])
if visitor == 1 then redis.call("EXPIRE", KEYS[1], ARGV[3]) end
total = redis.call("INCR", KEYS[3])
if total == 1 then redis.call("EXPIRE", KEYS[3], ARGV[3]) end
redis.call("SET", KEYS[2], "1", "EX", 600)
return {1, visitor, redis.call("TTL", KEYS[1]), total, redis.call("TTL", KEYS[3])}
`;
const readScript = `return {tonumber(redis.call("GET", KEYS[1]) or "0"), redis.call("TTL", KEYS[1]), tonumber(redis.call("GET", KEYS[2]) or "0"), redis.call("TTL", KEYS[2])}`;
const refundScript = `
if redis.call("DEL", KEYS[2]) == 0 then return {0} end
if tonumber(redis.call("GET", KEYS[1]) or "0") > 0 then redis.call("DECR", KEYS[1]) end
if tonumber(redis.call("GET", KEYS[3]) or "0") > 0 then redis.call("DECR", KEYS[3]) end
return {1}
`;

function createRedisClient() {
  return createClient({ url: redisUrl(), socket: { connectTimeout: 3000, reconnectStrategy: false } });
}

type RedisClient = ReturnType<typeof createRedisClient>;
let client: RedisClient | undefined;
let connecting: Promise<RedisClient> | undefined;

function redisUrl() {
  const url = process.env.REDIS_URL;
  if (!url || !/^rediss?:\/\//.test(url)) throw new Error("Brain wishes unavailable");
  return url;
}

function getClient(): Promise<RedisClient> {
  if (client?.isReady) return Promise.resolve(client);
  if (connecting) return connecting;

  const next = createRedisClient();
  // node-redis requires an error listener; connection failures are handled by callers.
  next.on("error", () => undefined);
  const promise = next.connect().then(() => {
    client = next;
    return next;
  }).catch(() => {
    next.destroy();
    throw new Error("Brain wishes unavailable");
  }).finally(() => {
    connecting = undefined;
  });
  connecting = promise;
  return promise;
}

async function evalRedis(script: string, keys: string[], expectedLength: number, args: number[] = []): Promise<number[]> {
  try {
    const result: unknown = await (await getClient()).eval(script, { keys, arguments: args.map(String) });
    if (!Array.isArray(result) || result.length !== expectedLength || result.some(value => !Number.isInteger(value))) throw new Error("Invalid Redis result");
    return result as number[];
  } catch {
    throw new Error("Brain wishes unavailable");
  }
}

function visitorKey(request: Request) {
  const ip = request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-forwarded-for");
  if (!ip && process.env.NODE_ENV === "production") throw new Error("Brain wishes unavailable");
  return "brain:wishes:v1:" + createHmac("sha256", redisUrl()).update(ip?.split(",")[0].trim() || "local-visitor").digest("hex");
}

function summary(visitor: number, visitorTtl: number, total: number, totalTtl: number) {
  const visitorRemaining = Math.max(0, limit - visitor);
  const globalRemaining = Math.max(0, globalLimit - total);
  const remaining = Math.min(visitorRemaining, globalRemaining);
  const resetSeconds = visitorRemaining === 0 && globalRemaining === 0
    ? Math.max(visitorTtl, totalTtl)
    : visitorRemaining <= globalRemaining ? visitorTtl : totalTtl;
  return { remaining, resetAt: new Date(Date.now() + Math.max(1, resetSeconds > 0 ? resetSeconds : windowSeconds) * 1000).toISOString() };
}

export async function readWishes(request: Request) {
  const [visitor, visitorTtl, total, totalTtl] = await evalRedis(readScript, [visitorKey(request), globalKey], 4);
  return summary(visitor, visitorTtl, total, totalTtl);
}

export async function reserveWish(request: Request, question: string) {
  const key = visitorKey(request);
  const repeatKey = key + ":repeat:" + createHash("sha256").update(question.toLowerCase()).digest("hex");
  const [status, visitor, visitorTtl, total, totalTtl] = await evalRedis(reserveScript, [key, repeatKey, globalKey], 5, [limit, globalLimit, windowSeconds]);
  return {
    status,
    ...summary(visitor, visitorTtl, total, totalTtl),
    refund: () => evalRedis(refundScript, [key, repeatKey, globalKey], 1),
  };
}
