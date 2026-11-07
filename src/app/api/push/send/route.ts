import { NextResponse } from "next/server";
import { cronAuthorized, pushConfigured, sendDueReminders } from "@/lib/push";

export const maxDuration = 60;

/**
 * Called once an hour by a scheduler with `Authorization: Bearer <CRON_SECRET>`.
 * Sends today's encouragement to devices whose chosen hour has arrived. See LAUNCH.md.
 */
async function handle(req: Request) {
  if (!cronAuthorized(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!pushConfigured) return NextResponse.json({ error: "Reminders aren't set up." }, { status: 503 });
  return NextResponse.json(await sendDueReminders());
}

export const GET = handle;
export const POST = handle;
