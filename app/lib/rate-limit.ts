import { createHash } from "node:crypto";

const HOUR_SECONDS = 60 * 60;

/** Abuse caps. The PRD requires the limits, not these exact counts. */
const IP_LIMIT = 8;
const PHONE_LIMIT = 5;

type Bucket = { count: number; resetAt: number };

const memory = new Map<string, Bucket>();

function memoryHit(key: string, limit: number, windowSeconds: number) {
  const now = Date.now();
  const current = memory.get(key);
  if (!current || current.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return false;
  }
  current.count += 1;
  return current.count > limit;
}

type UpstashItem = { result?: unknown; error?: string };

function upstashAuth() {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim().replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return { url, token };
}

function numericResult(item: unknown): number | null {
  if (!item || typeof item !== "object") return null;
  const entry = item as UpstashItem;
  if (typeof entry.error === "string") return null;
  return typeof entry.result === "number" && Number.isFinite(entry.result)
    ? entry.result
    : null;
}

/** `/pipeline` returns `[{ result }, { result }]`, one object per command. */
function pipelineNumbers(payload: unknown): [number, number] | null {
  if (!Array.isArray(payload) || payload.length < 2) return null;
  const count = numericResult(payload[0]);
  const ttl = numericResult(payload[1]);
  if (count === null || ttl === null) return null;
  return [count, ttl];
}

async function upstashPost(url: string, token: string, command: unknown) {
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
}

async function upstashHit(key: string, limit: number, windowSeconds: number) {
  const auth = upstashAuth();
  if (!auth) return null;

  let response: Response;
  try {
    response = await upstashPost(auth.url + "/pipeline", auth.token, [
      ["INCR", key],
      ["TTL", key],
    ]);
  } catch {
    return memoryHit(key, limit, windowSeconds);
  }

  if (!response.ok) return memoryHit(key, limit, windowSeconds);

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    return memoryHit(key, limit, windowSeconds);
  }

  const parsed = pipelineNumbers(payload);
  if (!parsed) return memoryHit(key, limit, windowSeconds);

  const [count, ttl] = parsed;
  // -1: key has no expiry. -2: key is missing. Either way, start the window.
  if (ttl < 0) {
    try {
      await upstashPost(auth.url, auth.token, ["EXPIRE", key, windowSeconds]);
    } catch {
      // The next hit still sees TTL < 0 and retries.
    }
  }

  return count > limit;
}

async function hit(key: string, limit: number, windowSeconds: number) {
  const shared = await upstashHit(key, limit, windowSeconds);
  if (shared !== null) return shared;
  return memoryHit(key, limit, windowSeconds);
}

export function hashPhone(phone: string) {
  return createHash("sha256").update(phone).digest("hex");
}

export async function submissionLimited(ip: string, phone: string) {
  const phoneKey = hashPhone(phone);
  const [ipLimited, phoneLimited] = await Promise.all([
    hit(`contact:ip:${ip}`, IP_LIMIT, HOUR_SECONDS),
    hit(`contact:phone:${phoneKey}`, PHONE_LIMIT, HOUR_SECONDS),
  ]);
  return ipLimited || phoneLimited;
}
