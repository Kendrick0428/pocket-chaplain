-- The Pocket Chaplain: initial schema.
-- Every table has row-level security ON and NO policies, so the public
-- (anon) and signed-in (authenticated) API roles can read or write nothing.
-- Only the app's server, using the secret service-role key, can reach the data.

create table public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('prayer', 'idea', 'followup')),
  status text not null default 'new' check (status in ('new', 'reviewed', 'archived')),
  created_at timestamptz not null default now(),
  data jsonb not null
);
create index submissions_created_at_idx on public.submissions (created_at desc);

-- Email addresses allowed into /admin. Add people with:
--   insert into public.admin_users (email) values ('chaplain@example.org');
create table public.admin_users (
  email text primary key check (email = lower(email)),
  added_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
alter table public.submissions  enable row level security;
alter table public.admin_users  enable row level security;

revoke all on public.site_content, public.submissions, public.admin_users from anon, authenticated;
