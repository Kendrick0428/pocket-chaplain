# Before launch: what needs to be connected

The prototype is safe to demo, but it is **not** ready for real prayer requests or contact details. Do these before turning off the prototype banner (Admin → Settings).

## 1. Secure database (built in, needs a Supabase project)

The app already supports Supabase. When `SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are set, all content and submissions are stored in Supabase instead of `data/store.json`.

- Schema: `supabase/migrations/0001_init.sql`. Row-level security is on for every table with no policies, so the public API can't read anything; only the app's server (secret key) can.
- Still to decide: a retention rule, e.g. delete reviewed prayer requests after 90 days.

## 2. Individual administrator accounts (built in)

In Supabase mode, each admin signs in with their own email and password.

- Only emails in the `admin_users` table can create an account or sign in.
  Add someone: `insert into public.admin_users (email) values ('name@example.org');`
- First time: on /admin, choose "Set up your account," confirm the email, then sign in.
- In Supabase → Authentication → URL Configuration, set **Site URL** to `https://thepocketchaplain.com` so confirmation links return to the app.
- Recommended next step: turn on two-step sign-in (Supabase Auth MFA) for admins.

## 3. Hosting and domain

- Host on Vercel, Netlify, Render, or the department/city's hosting (HTTPS is required).
- Point **thepocketchaplain.com** at it.
- Set the three `SUPABASE_*` values as environment variables in the host.

## 4. Policy and content review

- Have department legal/HR review the privacy page, especially public-records exposure for anything submitted.
- Decide who is in the "approved prayer group" and how requests get shared with them (today, the chaplain team shares manually).
- Decide who monitors submissions and how often, and say so on the privacy page.
- Verify every phone number and resource.
- Optional: email/text alerts to the chaplain when a follow-up request arrives.

## What stays private by design

Pastor and friend contacts are stored only in the officer's browser and never touch the server. Nothing changes here for launch.

## Your Supabase project (created 2026-10-13)

- Project: **The Pocket Chaplain** (`wnrfgwxvswozcjrkvjje`, us-east-1). Tables and security from `0001_init.sql` are applied; the public API roles have no access to any table.
- Hosting environment variables:
  - `SUPABASE_URL` = `https://wnrfgwxvswozcjrkvjje.supabase.co`
  - `SUPABASE_ANON_KEY` = `sb_publishable_ZAVWcLDQB98w7WNLtLDBxQ_33pwIuMK` (public key, safe to share)
  - `SUPABASE_SERVICE_ROLE_KEY` = copy the **secret** key from Supabase → Project Settings → API Keys. Paste it only into the hosting settings; never into chat, email, or code.
