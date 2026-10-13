import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase is used when these environment variables are set (see .env.example).
 * Without them the app falls back to the prototype file store and shared password.
 */
export const supabaseConfigured = Boolean(
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_ANON_KEY,
);

let admin: SupabaseClient | null = null;

/** Server-only client with the secret key. Never import this into a client component. */
export function serviceClient() {
  if (!admin) {
    admin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return admin;
}
