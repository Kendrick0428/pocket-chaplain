import "server-only";
import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import { cookies, headers } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { serviceClient, supabaseConfigured } from "./supabase";

/**
 * Administrator sign-in.
 *
 * - Supabase mode (launch): each administrator has their own account (email +
 *   password via Supabase Auth). Only emails listed in the admin_users table
 *   are let in.
 * - Prototype mode: one shared password from ADMIN_PASSWORD and a signed,
 *   HttpOnly session cookie.
 */

export const SESSION_COOKIE = "pc_admin";
const SESSION_HOURS = 8;
const DEV_PASSWORD = "pocket-chaplain-preview";

// A per-process fallback secret, so a missing SESSION_SECRET never means a guessable one.
const fallbackSecret = randomBytes(32).toString("hex");

function secret() {
  return process.env.SESSION_SECRET || fallbackSecret;
}

export function adminPasswordConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

/** In development only, allow a known preview password so the prototype can be tried immediately. */
function expectedPassword(): string | null {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  if (process.env.NODE_ENV !== "production") return DEV_PASSWORD;
  return null;
}

export function adminLoginAvailable() {
  return expectedPassword() !== null;
}

export function usingPreviewPassword() {
  return !supabaseConfigured && !process.env.ADMIN_PASSWORD && process.env.NODE_ENV !== "production";
}

function safeEqual(a: string, b: string) {
  const ha = createHmac("sha256", "cmp").update(a).digest();
  const hb = createHmac("sha256", "cmp").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(attempt: string) {
  const expected = expectedPassword();
  return expected !== null && safeEqual(attempt, expected);
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionToken() {
  const expires = Date.now() + SESSION_HOURS * 3600_000;
  const payload = `admin.${expires}.${randomBytes(8).toString("hex")}`;
  return { token: `${payload}.${sign(payload)}`, maxAge: SESSION_HOURS * 3600 };
}

function verifyToken(token: string | undefined) {
  if (!token) return false;
  const i = token.lastIndexOf(".");
  if (i < 0) return false;
  const payload = token.slice(0, i);
  const sig = token.slice(i + 1);
  if (!safeEqual(sig, sign(payload))) return false;
  const expires = Number(payload.split(".")[1]);
  return Number.isFinite(expires) && expires > Date.now();
}

/** Supabase Auth client bound to the request cookies (anon key; never the secret key). */
export async function authClient() {
  const jar = await cookies();
  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => jar.set(name, value, options));
        } catch {
          // Called from a server component: the proxy refreshes cookies instead.
        }
      },
    },
  });
}

export async function isAllowedAdminEmail(email: string) {
  const { data, error } = await serviceClient()
    .from("admin_users")
    .select("email")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();
  return !error && Boolean(data);
}

export async function isAdmin() {
  if (supabaseConfigured) {
    const { data } = await (await authClient()).auth.getUser();
    const email = data.user?.email;
    return Boolean(email && data.user?.email_confirmed_at && (await isAllowedAdminEmail(email)));
  }
  const jar = await cookies();
  return verifyToken(jar.get(SESSION_COOKIE)?.value);
}

/** Rejects cross-site form posts (defence in depth on top of SameSite=Strict cookies). */
export async function sameOrigin() {
  const h = await headers();
  const origin = h.get("origin");
  if (!origin) return true;
  const host = h.get("x-forwarded-host") || h.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// --- Very small in-memory rate limiter (per server process) ---
const hits = new Map<string, number[]>();

export async function rateLimited(bucket: string, limit: number, windowMs: number) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > limit;
}
