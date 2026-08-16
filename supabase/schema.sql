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
