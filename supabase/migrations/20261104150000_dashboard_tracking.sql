-- Owner dashboard (/admin/dashboard) + the tracking it reads.

-- 1. Starter list downloads. The email links to /api/starter-list, which
-- records the first download on the lead row and forwards to the PDF
-- (src/app/api/starter-list/route.ts).
alter table public.leads
  add column if not exists starter_downloaded_at timestamptz,
  -- language of the PDF opened first ('en', 'de', ...)
  add column if not exists starter_download_locale text;

-- /start (link-in-bio page) gets its own path so its conversion rate can be
-- measured separately from the homepage ('general').
alter table public.leads drop constraint if exists leads_path_check;
alter table public.leads
  add constraint leads_path_check
  check (path in ('home', 'shop', 'general', 'workshop', 'start'));

-- 2. First-party page views (src/app/api/pv/route.ts). No cookies, no IP,
-- no user agent: just the page, whether it was the first page of the visit,
-- and where the visit came from.
create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  -- page without the locale prefix, e.g. '/workshop'
  path text not null,
  locale text,
  -- first page of a visit (the landing page); count of these = visits
  is_entry boolean not null default false,
  ref text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  -- referring site of the landing page, host only (e.g. 'l.instagram.com')
  referrer_host text
);

create index if not exists page_views_created_at_idx
  on public.page_views (created_at desc);

-- Service role only (the API route and the dashboard).
alter table public.page_views enable row level security;

-- Daily totals per page and source, in the owner's time zone.
create or replace view public.page_view_daily
with (security_invoker = true) as
select
  (created_at at time zone 'Europe/Bratislava')::date as day,
  path,
  coalesce(ref, '') as ref,
  coalesce(utm_source, '') as utm_source,
  coalesce(referrer_host, '') as referrer_host,
  count(*) as views,
  count(*) filter (where is_entry) as visits
from public.page_views
group by 1, 2, 3, 4, 5;

revoke all on public.page_view_daily from anon, authenticated;

-- 3. Weekly social stats, entered by hand on the dashboard.
create table if not exists public.social_stats (
  id uuid primary key default gen_random_uuid(),
  -- Monday of the week the numbers are for
  week_start date not null,
  platform text not null check (platform in ('instagram', 'tiktok', 'youtube')),
  followers integer,
  best_post_url text,
  views integer,
  saves integer,
  comments integer,
  profile_visits integer,
  link_clicks integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (week_start, platform)
);

alter table public.social_stats enable row level security;
