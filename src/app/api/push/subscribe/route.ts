import { NextResponse } from "next/server";
import { rateLimited, sameOrigin } from "@/lib/auth";
import { pushConfigured, validTimeZone } from "@/lib/push";
import { deletePushSubscription, savePushSubscription } from "@/lib/store";

const B64URL = /^[A-Za-z0-9_-]+=*$/;

function validEndpoint(v: unknown): v is string {
  if (typeof v !== "string" || v.length > 1000) return false;
  try {
    return new URL(v).protocol === "https:";
  } catch {
    return false;
  }
}

async function guard() {
  if (!pushConfigured) return NextResponse.json({ error: "Reminders aren't set up yet." }, { status: 503 });
  if (!(await sameOrigin())) return NextResponse.json({ error: "Bad request." }, { status: 403 });
  if (await rateLimited("push", 20, 10 * 60_000)) return NextResponse.json({ error: "Please try again later." }, { status: 429 });
  return null;
}

/** Turns the daily reminder on (or changes its time) for this browser. */
export async function POST(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;

  const body = (await req.json().catch(() => null)) as {
    subscription?: { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } };
    hour?: unknown;
    tz?: unknown;
  } | null;
  const endpoint = body?.subscription?.endpoint;
  const p256dh = body?.subscription?.keys?.p256dh;
  const auth = body?.subscription?.keys?.auth;
  const hour = body?.hour;
  const tz = body?.tz;

  if (
    !validEndpoint(endpoint) ||
    typeof p256dh !== "string" || p256dh.length > 200 || !B64URL.test(p256dh) ||
    typeof auth !== "string" || auth.length > 100 || !B64URL.test(auth) ||
    typeof hour !== "number" || !Number.isInteger(hour) || hour < 0 || hour > 23 ||
    typeof tz !== "string" || !validTimeZone(tz)
  ) {
    return NextResponse.json({ error: "Invalid reminder." }, { status: 400 });
  }

  await savePushSubscription({ endpoint, p256dh, auth, hour, tz });
  return NextResponse.json({ ok: true });
}

/** Turns the daily reminder off for this browser. */
export async function DELETE(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;
  const body = (await req.json().catch(() => null)) as { endpoint?: unknown } | null;
  if (!validEndpoint(body?.endpoint)) return NextResponse.json({ error: "Invalid reminder." }, { status: 400 });
  await deletePushSubscription(body.endpoint);
  return NextResponse.json({ ok: true });
}
