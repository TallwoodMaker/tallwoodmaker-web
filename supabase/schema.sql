-- Run this in the Supabase SQL editor (Project → SQL Editor → New query).

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  stripe_customer_id text,
  subscription_status text,
  subscription_current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists subscribers_stripe_customer_id_idx
  on public.subscribers (stripe_customer_id);

-- RLS is on with no policies: this table is only ever read/written by the
-- server using the service-role key (see src/lib/supabase/admin.ts), so the
-- anon/authenticated roles get no direct access.
alter table public.subscribers enable row level security;

-- Premium launch waitlist (src/app/premium/subscribe/page.tsx countdown page).
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Same access model as subscribers: service-role only, no anon/authenticated
-- policies, since the waitlist form is submitted via a server action.
alter table public.waitlist enable row level security;

-- Premium member content, managed from /admin/premium-content
-- (src/app/admin/premium-content) and rendered on /premium
-- (src/app/premium/page.tsx) once published.
do $$ begin
  create type premium_content_type as enum ('video', 'plan_download', 'announcement');
exception
  when duplicate_object then null;
end $$;

-- Added for the member-dashboard article section (src/app/premium/page.tsx).
-- ALTER TYPE ... ADD VALUE can't run inside the same transaction as a
-- statement that uses the new value, but as its own statement here (outside
-- any explicit BEGIN/COMMIT) it's safe to run standalone in the SQL editor.
alter type premium_content_type add value if not exists 'article';

create table if not exists public.premium_content (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  content_type premium_content_type not null,
  video_embed_url text,
  file_url text,
  thumbnail_url text,
  -- Markdown source for content_type = 'article'; rendered to HTML with
  -- html:false (src/lib/markdown.ts) so no raw author HTML is ever injected.
  body_markdown text,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.premium_content add column if not exists body_markdown text;

create index if not exists premium_content_sort_order_idx
  on public.premium_content (sort_order);

-- Same access model as subscribers/waitlist: service-role only. Both the
-- admin page (all rows) and the public /premium page (published rows only)
-- read through src/lib/supabase/admin.ts, never the anon/authenticated role.
alter table public.premium_content enable row level security;

-- Storage buckets for premium content files. Created here via SQL so they
-- exist alongside the tables that reference them; run once. Both are
-- public-read: access to the /premium page is already gated by an active
-- subscription, and only an admin (checked in src/lib/admin.ts, re-checked
-- server-side in every admin action) can write to them, so a public read
-- policy is enough without adding signed-URL complexity.
insert into storage.buckets (id, name, public)
values ('premium-files', 'premium-files', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('premium-thumbnails', 'premium-thumbnails', true)
on conflict (id) do nothing;

-- Images embedded in article body_markdown (src/app/admin/premium-content
-- ContentForm.tsx's "Insert image" control), separate from
-- premium-thumbnails since an article can carry many of these.
insert into storage.buckets (id, name, public)
values ('premium-article-images', 'premium-article-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read premium-files" on storage.objects;
create policy "Public read premium-files" on storage.objects
  for select using (bucket_id = 'premium-files');

drop policy if exists "Public read premium-thumbnails" on storage.objects;
create policy "Public read premium-thumbnails" on storage.objects
  for select using (bucket_id = 'premium-thumbnails');

drop policy if exists "Public read premium-article-images" on storage.objects;
create policy "Public read premium-article-images" on storage.objects
  for select using (bucket_id = 'premium-article-images');

-- No insert/update/delete policies for anon/authenticated: all writes go
-- through the service-role client in admin server actions.

-- Lead magnet / waitlist signups. Same SQL as
-- supabase/migrations/20261029120000_create_leads.sql.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  -- 'starter-list' (10-tool starter list) or 'workshop-pricing' (live
  -- pricing workshop waitlist)
  source text not null check (source in ('starter-list', 'workshop-pricing')),
  -- which part of the site it came from
  path text check (path in ('home', 'shop', 'general')),
  locale text,
  created_at timestamptz not null default now(),
  unique (email, source)
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- Anonymous visitors may only add a row; nobody but the service role can
-- read, change or delete. The form posts through a server action using the
-- anon key, and /admin/leads reads with the service-role key.
alter table public.leads enable row level security;

drop policy if exists "Anyone can add a lead" on public.leads;
create policy "Anyone can add a lead" on public.leads
  for insert to anon, authenticated
  with check (true);

revoke select, update, delete on public.leads from anon, authenticated;
grant insert on public.leads to anon, authenticated;

-- Traffic source of a lead. Same SQL as
-- supabase/migrations/20261029170000_add_leads_ref.sql.
alter table public.leads add column if not exists ref text;

alter table public.leads drop constraint if exists leads_ref_check;
alter table public.leads
  add constraint leads_ref_check check (ref is null or ref in ('ig', 'tt', 'yt'));

-- Email delivery and marketing consent. Same SQL as
-- supabase/migrations/20261029190000_leads_email_consent.sql.
alter table public.leads
  add column if not exists marketing_consent boolean not null default false,
  -- when and with which (localized) checkbox text consent was given
  add column if not exists consent_at timestamptz,
  add column if not exists consent_text text,
  add column if not exists starter_sent_at timestamptz,
  add column if not exists unsubscribed_at timestamptz,
  -- random secret used in /unsubscribe?token=… links (two v4 UUIDs, ~244
  -- random bits; gen_random_uuid is core Postgres, no extension needed)
  add column if not exists unsubscribe_token text not null
    default replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');

create unique index if not exists leads_unsubscribe_token_key
  on public.leads (unsubscribe_token);

-- Workshop waitlist page fields + workshop_waitlist view. Same SQL as
-- supabase/migrations/20261104120000_leads_workshop_waitlist.sql.
alter table public.leads
  add column if not exists first_name text,
  -- 'own-shop' (runs a shop), 'starting-shop' or 'home' (builds at home)
  add column if not exists segment text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists utm_term text;

alter table public.leads drop constraint if exists leads_segment_check;
alter table public.leads
  add constraint leads_segment_check
  check (segment is null or segment in ('own-shop', 'starting-shop', 'home'));

alter table public.leads drop constraint if exists leads_path_check;
alter table public.leads
  add constraint leads_path_check
  check (path in ('home', 'shop', 'general', 'workshop'));

-- Workshop signups only, newest first, for Supabase → Table Editor.
-- security_invoker: the view reads with the caller's rights, so like
-- `leads` itself only the service role / dashboard can see it.
create or replace view public.workshop_waitlist
with (security_invoker = true) as
select
  created_at,
  email,
  first_name,
  segment,
  locale,
  path,
  ref,
  utm_source,
  utm_medium,
  utm_campaign,
  utm_content,
  utm_term,
  consent_at,
  unsubscribed_at
from public.leads
where source = 'workshop-pricing'
order by created_at desc;

revoke all on public.workshop_waitlist from anon, authenticated;

-- Dashboard tracking (downloads, page views, social stats). Same SQL as
-- supabase/migrations/20261104150000_dashboard_tracking.sql.
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
