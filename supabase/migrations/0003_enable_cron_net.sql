-- Supabase's built-in scheduler and HTTP client, used to call the hourly
-- daily-reminder route (see 0004 and LAUNCH.md §5).
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;
