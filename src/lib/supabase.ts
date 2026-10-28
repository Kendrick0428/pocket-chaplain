import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase is used when these environment variables are set (see .env.example).
 * Without them the app falls back to the prototype file store and shared password.
 */
export const supabaseConfigured = Boolean(
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_ANON_KEY,
);

/**
 * Database schema holding this site's tables. Editions that share one Supabase
 * project keep their data apart in separate schemas (e.g. "fire"; see 0003_fire_schema.sql).
 */
const SCHEMA = process.env.SUPABASE_SCHEMA || "public";

let admin: SupabaseClient<any, string, any> | null = null; // eslint-disable-line @typescript-eslint/no-explicit-any

/** Server-only client with the secret key. Never import this into a client component. */
export function serviceClient() {
  if (!admin) {
    admin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
      db: { schema: SCHEMA },
    });
  }
  return admin;
}
