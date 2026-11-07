-- Optional daily reminder notifications.
-- Each row is a browser's anonymous push address plus the hour and time zone
-- the person chose. Nothing here identifies a person, and the admin area never
-- shows it. Same lockdown as 0001: RLS on, no policies, no API-role grants.

create table public.push_subscriptions (
  endpoint text primary key check (endpoint like 'https://%' and length(endpoint) <= 1000),
  p256dh text not null check (length(p256dh) <= 200),
  auth text not null check (length(auth) <= 100),
  hour smallint not null check (hour between 0 and 23),
  tz text not null check (length(tz) <= 64),
  last_sent_on date,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;
revoke all on public.push_subscriptions from anon, authenticated;
