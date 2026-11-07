import "server-only";
import { timingSafeEqual } from "crypto";
import webpush from "web-push";
import { dailyIndex, localDate } from "./daily";
import { serviceClient, supabaseConfigured } from "./supabase";
import { deletePushSubscription, getContent, listPushSubscriptions, markPushSent } from "./store";

/**
 * Optional daily reminder notifications (Web Push).
 * Needs VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY and CRON_SECRET (see .env.example).
 * Without them the reminder page offers a calendar reminder instead.
 */
export const pushConfigured = Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);

export const vapidPublicKey = () => (pushConfigured ? process.env.VAPID_PUBLIC_KEY! : "");

let configured = false;
function setup() {
  if (configured) return;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "https://thepocketchaplain.com",
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );
  configured = true;
}

export function validTimeZone(tz: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return tz.length <= 64;
  } catch {
    return false;
  }
}

/**
 * Checks the scheduler's `Authorization: Bearer <token>` header. The token is either
 * CRON_SECRET from the host settings, or the one Supabase creates and keeps for its
 * own hourly job (migration 0004), checked through a yes/no database function.
 */
export async function cronAuthorized(header: string | null) {
  if (!header?.startsWith("Bearer ")) return false;
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const a = Buffer.from(header);
    const b = Buffer.from(`Bearer ${secret}`);
    if (a.length === b.length && timingSafeEqual(a, b)) return true;
  }
  const token = header.slice(7).trim();
  if (!supabaseConfigured || !/^[0-9a-f]{64}$/.test(token)) return false;
  const { data, error } = await serviceClient().rpc("cron_token_valid", { candidate: token });
  return !error && data === true;
}

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

/**
 * Sends today's encouragement to everyone whose chosen hour is now in their own time zone.
 * Meant to be called once an hour. Each device gets at most one reminder per local day.
 */
export async function sendDueReminders(now = new Date()) {
  setup();
  const [subs, content] = await Promise.all([listPushSubscriptions(), getContent()]);
  // The server never learns anyone's faith, so notifications use encouragements written for everyone.
  const general = content.encouragements.filter((e) => e.tradition === "all");
  const encouragements = general.length ? general : content.encouragements;
  const due = subs
    .map((s) => ({ s, local: localDate(now, s.tz) }))
    .filter(({ s, local }) => local.hour === s.hour && s.lastSentOn !== local.iso);

  let sent = 0;
  let removed = 0;
  const sentByDate = new Map<string, string[]>();

  for (let i = 0; i < due.length; i += 50) {
    await Promise.all(
      due.slice(i, i + 50).map(async ({ s, local }) => {
        const item = encouragements[dailyIndex(encouragements.length, now, s.tz)];
        const body = item ? clip(item.reference ? `${item.text} (${item.reference})` : item.text, 230) : "";
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
            JSON.stringify({ title: "Today's encouragement", body, url: "/home" }),
            { TTL: 6 * 60 * 60 },
          );
          sent++;
          sentByDate.set(local.iso, [...(sentByDate.get(local.iso) ?? []), s.endpoint]);
        } catch (err) {
          const status = (err as { statusCode?: number }).statusCode;
          // 404/410: the browser unsubscribed or the app was removed. Forget it.
          if (status === 404 || status === 410) {
            await deletePushSubscription(s.endpoint);
            removed++;
          }
        }
      }),
    );
  }

  for (const [date, endpoints] of sentByDate) await markPushSent(endpoints, date);
  return { checked: subs.length, due: due.length, sent, removed };
}
