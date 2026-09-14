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

drop policy if exists "Public read premium-files" on storage.objects;
create policy "Public read premium-files" on storage.objects
  for select using (bucket_id = 'premium-files');

drop policy if exists "Public read premium-thumbnails" on storage.objects;
create policy "Public read premium-thumbnails" on storage.objects
  for select using (bucket_id = 'premium-thumbnails');

-- No insert/update/delete policies for anon/authenticated: all writes go
-- through the service-role client in admin server actions.
