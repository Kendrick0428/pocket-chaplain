"use server";

import { addSubmission } from "@/lib/store";
import { rateLimited } from "@/lib/auth";
import { IDEA_CATEGORIES, type IdeaCategory } from "@/lib/types";

export interface FormState {
  ok: boolean;
  error?: string;
}

function field(fd: FormData, name: string, max: number) {
  const v = fd.get(name);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** Bots fill in the hidden "website" field; people never see it. */
function isBot(fd: FormData) {
  return field(fd, "website", 200) !== "";
}

const TOO_MANY = "You've sent several messages in a short time. Please wait a few minutes and try again.";

export async function submitPrayerRequest(_prev: FormState, fd: FormData): Promise<FormState> {
  if (isBot(fd)) return { ok: true };
  if (await rateLimited("prayer", 5, 10 * 60_000)) return { ok: false, error: TOO_MANY };

  const request = field(fd, "request", 1000);
  if (!request) return { ok: false, error: "Please share your prayer request." };

  const anonymous = fd.get("anonymous") === "on";
  const visibility = fd.get("visibility") === "prayer-group" ? "prayer-group" : "chaplain";

  await addSubmission({
    kind: "prayer",
    anonymous,
    name: anonymous ? "" : field(fd, "name", 80),
    visibility,
    request,
  });
  return { ok: true };
}

export async function submitIdea(_prev: FormState, fd: FormData): Promise<FormState> {
  if (isBot(fd)) return { ok: true };
  if (await rateLimited("idea", 5, 10 * 60_000)) return { ok: false, error: TOO_MANY };

  const idea = field(fd, "idea", 1500);
  if (!idea) return { ok: false, error: "Please describe your idea." };

  const raw = field(fd, "category", 20);
  const category = (IDEA_CATEGORIES.some((c) => c.id === raw) ? raw : "other") as IdeaCategory;
  const anonymous = fd.get("anonymous") === "on";

  await addSubmission({
    kind: "idea",
    anonymous,
    name: anonymous ? "" : field(fd, "name", 80),
    category,
    idea,
  });
  return { ok: true };
}

export async function submitFollowUp(_prev: FormState, fd: FormData): Promise<FormState> {
  if (isBot(fd)) return { ok: true };
  if (await rateLimited("followup", 5, 10 * 60_000)) return { ok: false, error: TOO_MANY };

  const name = field(fd, "name", 80);
  const contact = field(fd, "contact", 120);
  const method = field(fd, "contactMethod", 10);
  const contactMethod = method === "text" || method === "email" ? method : "call";

  if (!name) return { ok: false, error: "Please tell the chaplain what to call you." };
  if (!contact) return { ok: false, error: "Please add a phone number or email so the chaplain can reach you." };

  await addSubmission({
    kind: "followup",
    name,
    contactMethod,
    contact,
    bestTime: field(fd, "bestTime", 120),
    note: field(fd, "note", 500),
  });
  return { ok: true };
}
