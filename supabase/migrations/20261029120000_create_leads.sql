-- Email leads from the site's lead magnet and waitlist forms
-- (src/components/LeadForm.tsx → src/lib/leads.ts).

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
