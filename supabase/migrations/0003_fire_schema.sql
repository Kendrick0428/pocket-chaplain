-- Pocket Chaplain: Fire & Rescue, sharing this Supabase project with the
-- law-enforcement site. Its data lives in its own "fire" schema, so neither
-- site can see the other's content, submissions, admins, or reminders.
-- The fire site sets SUPABASE_SCHEMA=fire. Same lockdown as 0001/0002:
-- RLS on, no policies, no anon/authenticated access; only the server's
-- secret service-role key can reach the data.

create schema if not exists fire;

create table fire.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table fire.submissions (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('prayer', 'idea', 'followup')),
  status text not null default 'new' check (status in ('new', 'reviewed', 'archived')),
  created_at timestamptz not null default now(),
  data jsonb not null
);
create index fire_submissions_created_at_idx on fire.submissions (created_at desc);

-- Email addresses allowed into the fire site's /admin. Add people with:
--   insert into fire.admin_users (email) values ('chaplain@example.org');
create table fire.admin_users (
  email text primary key check (email = lower(email)),
  added_at timestamptz not null default now()
);

create table fire.push_subscriptions (
  endpoint text primary key check (endpoint like 'https://%' and length(endpoint) <= 1000),
  p256dh text not null check (length(p256dh) <= 200),
  auth text not null check (length(auth) <= 100),
  hour smallint not null check (hour between 0 and 23),
  tz text not null check (length(tz) <= 64),
  last_sent_on date,
  created_at timestamptz not null default now()
);

alter table fire.site_content       enable row level security;
alter table fire.submissions        enable row level security;
alter table fire.admin_users        enable row level security;
alter table fire.push_subscriptions enable row level security;

revoke all on schema fire from anon, authenticated;
revoke all on all tables in schema fire from anon, authenticated;

grant usage on schema fire to service_role;
grant all on all tables in schema fire to service_role;
