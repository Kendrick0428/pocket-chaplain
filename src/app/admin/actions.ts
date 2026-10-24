"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import {
  SESSION_COOKIE,
  adminLoginAvailable,
  authClient,
  checkPassword,
  isAllowedAdminEmail,
  createSessionToken,
  isAdmin,
  rateLimited,
} from "@/lib/auth";
import { supabaseConfigured } from "@/lib/supabase";
import { deleteSubmission, setSubmissionStatus, updateContent } from "@/lib/store";
import {
  ENTRY_TYPES,
  RESOURCE_CATEGORIES,
  TOPICS,
  TRADITIONS,
  type ChaplainContact,
  type Encouragement,
  type EntryType,
  type LibraryEntry,
  type Resource,
  type ResourceCategory,
  type Settings,
  type SubmissionStatus,
  type TopicId,
  type TraditionId,
} from "@/lib/types";

export interface AdminState {
  ok: boolean;
  error?: string;
  message?: string;
}

async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Not authorized");
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// ---------- Session ----------

const TOO_MANY_LOGINS = "Too many sign-in attempts. Please wait 15 minutes and try again.";

export async function login(_prev: AdminState, fd: FormData): Promise<AdminState> {
  if (await rateLimited("login", 8, 15 * 60_000)) return { ok: false, error: TOO_MANY_LOGINS };

  if (supabaseConfigured) {
    const email = str(fd.get("email"), 200).toLowerCase();
    const password = str(fd.get("password"), 200);
    if (!email || !password) return { ok: false, error: "Enter your email and password." };
    const supabase = await authClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return {
        ok: false,
        error: /confirm/i.test(error.message)
          ? "Please confirm your email first. Check your inbox for the confirmation link."
          : "That email and password don't match an administrator account.",
      };
    }
    if (!(await isAllowedAdminEmail(email))) {
      await supabase.auth.signOut();
      return { ok: false, error: "That account isn't on the administrator list." };
    }
    redirect("/admin");
  }

  if (!adminLoginAvailable()) {
    return { ok: false, error: "Administrator sign-in isn't set up yet. Set ADMIN_PASSWORD and SESSION_SECRET on the server (see README)." };
  }
  const password = str(fd.get("password"), 200);
  if (!checkPassword(password)) {
    return { ok: false, error: "That password isn't right." };
  }
  const { token, maxAge } = createSessionToken();
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge,
  });
  redirect("/admin");
}

/**
 * First-time setup for someone whose email is already on the administrator
 * list. Anyone else is refused before an account is created.
 */
export async function createAdminAccount(_prev: AdminState, fd: FormData): Promise<AdminState> {
  if (!supabaseConfigured) return { ok: false, error: "Accounts are only used once the database is connected." };
  if (await rateLimited("signup", 5, 60 * 60_000)) return { ok: false, error: TOO_MANY_LOGINS };

  const email = str(fd.get("email"), 200).toLowerCase();
  const password = str(fd.get("password"), 200);
  if (!email) return { ok: false, error: "Enter your email address." };
  if (password.length < 12) return { ok: false, error: "Choose a password of at least 12 characters." };
  // Same answer whether or not the email is listed, so the list can't be probed.
  const generic: AdminState = {
    ok: true,
    message: "If that email is on the administrator list, a confirmation link is on its way. Open it, then come back here and sign in.",
  };
  if (!(await isAllowedAdminEmail(email))) return generic;

  const h = await headers();
  const origin = h.get("origin") || `https://${h.get("host")}`;
  const { error } = await (await authClient()).auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/admin` },
  });
  if (error && !/already registered/i.test(error.message)) {
    return { ok: false, error: "Couldn't create the account. Please try again in a few minutes." };
  }
  return generic;
}

export async function logout() {
  if (supabaseConfigured) await (await authClient()).auth.signOut();
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/admin");
}

// ---------- Submissions ----------

export async function changeSubmissionStatus(fd: FormData) {
  await requireAdmin();
  const id = str(fd.get("id"), 64);
  const status = str(fd.get("status"), 10) as SubmissionStatus;
  if (["new", "reviewed", "archived"].includes(status)) await setSubmissionStatus(id, status);
  revalidatePath("/admin");
}

export async function removeSubmission(fd: FormData) {
  await requireAdmin();
  await deleteSubmission(str(fd.get("id"), 64));
  revalidatePath("/admin");
}

// ---------- Content ----------

function done(paths: string[]): AdminState {
  for (const p of paths) revalidatePath(p);
  return { ok: true, message: "Saved." };
}

// Raster images only (never SVG, which can carry scripts). The browser resizes the badge before upload.
const LOGO_RE = /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+=*$/;
const MAX_LOGO = 300_000;

export async function saveSettings(_prev: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const logo = str(fd.get("departmentLogo"), MAX_LOGO + 1);
  if (logo && (logo.length > MAX_LOGO || !LOGO_RE.test(logo))) {
    return { ok: false, error: "The badge image couldn't be used. Please try a PNG or JPEG under 2 MB." };
  }
  const website = str(fd.get("departmentWebsite"), 300);
  if (website && !/^https?:\/\//i.test(website)) {
    return { ok: false, error: "The website should start with https://" };
  }
  const settings: Settings = {
    appName: str(fd.get("appName"), 80) || "The Pocket Chaplain",
    departmentName: str(fd.get("departmentName"), 120),
    departmentLogo: logo,
    departmentAddress: str(fd.get("departmentAddress"), 300),
    departmentPhone: str(fd.get("departmentPhone"), 30),
    departmentEmail: str(fd.get("departmentEmail"), 120),
    departmentWebsite: website,
    prototypeMode: fd.get("prototypeMode") === "on",
  };
  await updateContent("settings", settings);
  return done(["/", "/about", "/admin/settings"]);
}

export async function saveChaplain(_prev: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const chaplain: ChaplainContact = {
    name: str(fd.get("name"), 120),
    title: str(fd.get("title"), 80),
    phone: str(fd.get("phone"), 30),
    textPhone: str(fd.get("textPhone"), 30),
    availability: str(fd.get("availability"), 300),
    note: str(fd.get("note"), 300),
  };
  await updateContent("chaplain", chaplain);
  return done(["/reach/chaplain", "/admin/chaplain"]);
}

/** Lists are edited in the browser and saved as one JSON payload, then re-validated here. */
function parseList(fd: FormData): unknown[] {
  try {
    const v = JSON.parse(str(fd.get("payload"), 500_000));
    return Array.isArray(v) ? v.slice(0, 1000) : [];
  } catch {
    return [];
  }
}

const id = (v: unknown) => str(v, 64) || randomUUID();

const TRADITION_IDS = TRADITIONS.map((t) => t.id) as string[];
const tradition = (v: unknown): TraditionId => (TRADITION_IDS.includes(str(v, 20)) ? str(v, 20) : "all") as TraditionId;

export async function saveEncouragements(_prev: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const list: Encouragement[] = parseList(fd)
    .map((x) => x as Record<string, unknown>)
    .map((x) => ({ id: id(x.id), text: str(x.text, 600), reference: str(x.reference, 120), tradition: tradition(x.tradition) }))
    .filter((x) => x.text);
  await updateContent("encouragements", list);
  return done(["/", "/admin/encouragements"]);
}

export async function saveLibrary(_prev: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const types = ENTRY_TYPES.map((t) => t.id) as string[];
  const topics = TOPICS.map((t) => t.id) as string[];
  const list: LibraryEntry[] = parseList(fd)
    .map((x) => x as Record<string, unknown>)
    .map((x) => ({
      id: id(x.id),
      title: str(x.title, 140),
      type: (types.includes(str(x.type, 20)) ? str(x.type, 20) : "prayer") as EntryType,
      topics: (Array.isArray(x.topics) ? x.topics : []).filter((t): t is TopicId => topics.includes(t as string)),
      body: str(x.body, 4000),
      reference: str(x.reference, 120),
      tradition: tradition(x.tradition),
    }))
    .filter((x) => x.title && x.body);
  await updateContent("library", list);
  return done(["/pocket-chaplain", "/family", "/admin/library"]);
}

export async function saveResources(_prev: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const cats = RESOURCE_CATEGORIES.map((c) => c.id) as string[];
  const list: Resource[] = parseList(fd)
    .map((x) => x as Record<string, unknown>)
    .map((x) => ({
      id: id(x.id),
      category: (cats.includes(str(x.category, 20)) ? str(x.category, 20) : "chaplain") as ResourceCategory,
      name: str(x.name, 140),
      description: str(x.description, 1000),
      phone: str(x.phone, 30),
      text: str(x.text, 30),
      url: str(x.url, 300),
      hours: str(x.hours, 120),
    }))
    .filter((x) => x.name);
  await updateContent("resources", list);
  return done(["/resources", "/admin/resources"]);
}
