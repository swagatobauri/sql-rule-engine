import { createClient } from "redis";
import { settings } from "../../config/settings.js";

const client = createClient({ url: settings.REDIS_URL });
let connectPromise: Promise<unknown> | null = null;
let redisAvailable = true;
let redisErrorLogged = false;

client.on("error", (err) => {
  if (!redisErrorLogged) {
    console.error("Redis error:", err);
    redisErrorLogged = true;
  }
  redisAvailable = false;
});

async function ensureRedisConnection(): Promise<boolean> {
  if (!redisAvailable) {
    return false;
  }

  if (client.isOpen) {
    return true;
  }

  if (!connectPromise) {
    connectPromise = client.connect();
  }

  try {
    await connectPromise;
    return true;
  } catch {
    redisAvailable = false;
    connectPromise = null;
    return false;
  }
}

export async function getCache(key: string): Promise<any | null> {
  const canUseRedis = await ensureRedisConnection();
  if (!canUseRedis) {
    return null;
  }
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
}

export async function setCache(key: string, value: any, ttl = 3600): Promise<void> {
  const canUseRedis = await ensureRedisConnection();
  if (!canUseRedis) {
    return;
  }
  await client.set(key, JSON.stringify(value), { EX: ttl });
}
