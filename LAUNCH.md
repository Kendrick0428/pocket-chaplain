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

## 5. Daily reminders (optional)

The Daily reminder page sends today's encouragement as a phone notification at a time each person picks. Without this setup the page still offers a calendar reminder, so nothing breaks if you skip it.

1. Apply `supabase/migrations/0002_push_subscriptions.sql` (adds the anonymous reminder table, locked down like the others).
2. Generate keys once: `npx web-push generate-vapid-keys`. In the host, set `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` (e.g. `mailto:chaplain@example.org`) and `CRON_SECRET` (a long random string).
3. Call `https://thepocketchaplain.com/api/push/send` once an hour with the header `Authorization: Bearer <CRON_SECRET>`. Hourly is needed because people pick their own time. One way, using Supabase's built-in scheduler (enable the `pg_cron` and `pg_net` extensions first):

   ```sql
   select cron.schedule('pocket-chaplain-reminders', '0 * * * *', $$
     select net.http_get(
       url := 'https://thepocketchaplain.com/api/push/send',
       headers := jsonb_build_object('Authorization', 'Bearer <CRON_SECRET>')
     );
   $$);
   ```

   (Vercel's own cron also works, but its free plan only allows once a day.)

iPhone users must add the app to their Home Screen before notifications can be turned on; the page explains this.

## What stays private by design

Pastor and friend contacts, saved prayers, and "How am I doing?" check-ins are stored only in the officer's browser and never touch the server. Nothing changes here for launch.

## Your Supabase project (created 2026-10-13)

- Project: **The Pocket Chaplain** (`wnrfgwxvswozcjrkvjje`, us-east-1). Tables and security from `0001_init.sql` are applied; the public API roles have no access to any table.
- Hosting environment variables:
  - `SUPABASE_URL` = `https://wnrfgwxvswozcjrkvjje.supabase.co`
  - `SUPABASE_ANON_KEY` = `sb_publishable_ZAVWcLDQB98w7WNLtLDBxQ_33pwIuMK` (public key, safe to share)
  - `SUPABASE_SERVICE_ROLE_KEY` = copy the **secret** key from Supabase → Project Settings → API Keys. Paste it only into the hosting settings; never into chat, email, or code.

## 6. Pocket Chaplain: Fire & Rescue at fire.thepocketchaplain.com

The Fire & Rescue edition is the same code deployed as a second site. It needs its own hosting project and its own data, so fire submissions never mix with the law-enforcement site.

1. **Hosting.** In Vercel, choose Add New → Project and import this same GitHub repository again. Name it `pocket-chaplain-fire`.
2. **Environment variables** for that project:
   - `NEXT_PUBLIC_EDITION` = `fire` (this is what turns it into the Fire & Rescue edition)
   - `ADMIN_PASSWORD` and `SESSION_SECRET`: new values, different from the law-enforcement site
   - The `SUPABASE_*` values for the fire site's own database, once it has one (see step 4)
3. **Domain.** In the Vercel project, open Settings → Domains and add `fire.thepocketchaplain.com`. Then, wherever thepocketchaplain.com's DNS is managed, add the record Vercel shows. It is normally:

   | Type | Name | Value |
   |---|---|---|
   | CNAME | `fire` | `cname.vercel-dns.com` |

   HTTPS is issued automatically once the record is found, usually within an hour.
4. **Database.** The fire site needs its own Supabase project (run `0001_init.sql` and, for reminders, `0002_push_subscriptions.sql` in it, add the fire admins to `admin_users`, and set its Auth **Site URL** to `https://fire.thepocketchaplain.com`). Until then, keep the prototype banner on: pages and the library work, but forms and admin edits can't be saved on Vercel without a database.
5. **Reminders (optional).** Same as section 5, with its own `CRON_SECRET` and the URL `https://fire.thepocketchaplain.com/api/push/send`.
