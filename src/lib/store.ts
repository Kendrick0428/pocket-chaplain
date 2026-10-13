import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { seedContent } from "./seed";
import { serviceClient, supabaseConfigured } from "./supabase";
import type { SiteContent, Store, Submission } from "./types";

/**
 * All storage goes through this file.
 *
 * - With Supabase configured (SUPABASE_URL etc.), content and submissions are
 *   stored in Postgres tables that only the server can reach (see
 *   supabase/migrations). This is the launch setup.
 * - Without it, everything lives in data/store.json. That is fine for local
 *   previewing only: it is not encrypted and doesn't work on serverless hosts.
 */

type NewSubmission = Submission extends infer S
  ? S extends Submission
    ? Omit<S, "id" | "createdAt" | "status">
    : never
  : never;

const CONTENT_KEYS = ["settings", "chaplain", "encouragements", "library", "resources"] as const;

// ---------------------------------------------------------------------------
// Supabase backend
// ---------------------------------------------------------------------------

async function sbGetContent(): Promise<SiteContent> {
  const { data, error } = await serviceClient().from("site_content").select("key, value");
  if (error) throw new Error(`Could not load content: ${error.message}`);
  const content = structuredClone(seedContent) as SiteContent;
  for (const row of data ?? []) {
    if ((CONTENT_KEYS as readonly string[]).includes(row.key)) {
      (content as unknown as Record<string, unknown>)[row.key] = row.value;
    }
  }
  return content;
}

async function sbUpdateContent(key: keyof SiteContent, value: unknown) {
  const { error } = await serviceClient()
    .from("site_content")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw new Error(`Could not save content: ${error.message}`);
}

async function sbAddSubmission(sub: NewSubmission) {
  const { kind, ...data } = sub;
  const { data: row, error } = await serviceClient().from("submissions").insert({ kind, data }).select("id").single();
  if (error) throw new Error(`Could not save submission: ${error.message}`);
  return row.id as string;
}

async function sbListSubmissions(): Promise<Submission[]> {
  const { data, error } = await serviceClient()
    .from("submissions")
    .select("id, kind, status, created_at, data")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) throw new Error(`Could not load submissions: ${error.message}`);
  return (data ?? []).map((r) => ({ ...r.data, id: r.id, kind: r.kind, status: r.status, createdAt: r.created_at }) as Submission);
}

async function sbSetStatus(id: string, status: Submission["status"]) {
  const { error, count } = await serviceClient().from("submissions").update({ status }, { count: "exact" }).eq("id", id);
  if (error) throw new Error(error.message);
  return Boolean(count);
}

async function sbDelete(id: string) {
  const { error, count } = await serviceClient().from("submissions").delete({ count: "exact" }).eq("id", id);
  if (error) throw new Error(error.message);
  return Boolean(count);
}

// ---------------------------------------------------------------------------
// Prototype file backend
// ---------------------------------------------------------------------------

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");
let writeQueue: Promise<unknown> = Promise.resolve();

async function readStore(): Promise<Store> {
  try {
    const parsed = JSON.parse(await fs.readFile(STORE_FILE, "utf8")) as Partial<Store>;
    return { ...structuredClone(seedContent), submissions: [], ...parsed } as Store;
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return { ...structuredClone(seedContent), submissions: [] };
    throw err;
  }
}

async function writeStore(store: Store) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${STORE_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store, null, 2), { encoding: "utf8", mode: 0o600 });
  await fs.rename(tmp, STORE_FILE);
}

/** Serialises read-modify-write cycles so concurrent requests don't clobber each other. */
function mutate<T>(fn: (store: Store) => T | Promise<T>): Promise<T> {
  const run = writeQueue.then(async () => {
    const store = await readStore();
    const result = await fn(store);
    await writeStore(store);
    return result;
  });
  writeQueue = run.catch(() => undefined);
  return run;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Public content. Never includes submissions. */
export async function getContent(): Promise<SiteContent> {
  if (supabaseConfigured) return sbGetContent();
  const { submissions: _omit, ...content } = await readStore();
  return content;
}

export async function updateContent<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
  if (supabaseConfigured) return sbUpdateContent(key, value);
  return mutate((store) => {
    store[key] = value as Store[K];
  });
}

export async function addSubmission(sub: NewSubmission) {
  if (supabaseConfigured) return sbAddSubmission(sub);
  return mutate((store) => {
    const full = { ...sub, id: randomUUID(), createdAt: new Date().toISOString(), status: "new" } as Submission;
    store.submissions.unshift(full);
    return full.id;
  });
}

/** Admin only. Callers must check the admin session first. */
export async function listSubmissions(): Promise<Submission[]> {
  if (supabaseConfigured) return sbListSubmissions();
  return (await readStore()).submissions;
}

export async function setSubmissionStatus(id: string, status: Submission["status"]) {
  if (supabaseConfigured) return sbSetStatus(id, status);
  return mutate((store) => {
    const sub = store.submissions.find((s) => s.id === id);
    if (sub) sub.status = status;
    return Boolean(sub);
  });
}

export async function deleteSubmission(id: string) {
  if (supabaseConfigured) return sbDelete(id);
  return mutate((store) => {
    const before = store.submissions.length;
    store.submissions = store.submissions.filter((s) => s.id !== id);
    return store.submissions.length !== before;
  });
}
