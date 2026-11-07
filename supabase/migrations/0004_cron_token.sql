-- A random token the hourly scheduler sends to /api/push/send, created and kept
-- inside the database so nobody has to copy it anywhere. The `private` schema is
-- not exposed through the API; the site checks a token only through
-- cron_token_valid(), which just answers yes or no and only the server key may call.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table private.cron_token (
  id smallint primary key default 1 check (id = 1),
  token text not null default encode(extensions.gen_random_bytes(32), 'hex'),
  created_at timestamptz not null default now()
);
insert into private.cron_token default values on conflict do nothing;

create or replace function public.cron_token_valid(candidate text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from private.cron_token where token = candidate);
$$;

revoke all on function public.cron_token_valid(text) from public, anon, authenticated;
grant execute on function public.cron_token_valid(text) to service_role;

-- Hourly job. Replaces an earlier version that read a Vault secret.
select cron.unschedule(jobid) from cron.job where jobname = 'pocket-chaplain-reminders';
select cron.schedule('pocket-chaplain-reminders', '0 * * * *', $job$
  select net.http_get(
    url := 'https://pocket-chaplain.vercel.app/api/push/send',
    headers := jsonb_build_object('Authorization', 'Bearer ' || (select token from private.cron_token where id = 1))
  );
$job$);
