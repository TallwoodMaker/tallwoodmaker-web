-- /workshop waitlist page ("Price a Job With Profit",
-- src/app/[locale]/(site)/workshop). Signups are leads with
-- source = 'workshop-pricing', path = 'workshop', plus the visitor's first
-- name, the "I am..." answer and the UTM tags of the visit
-- (written by joinWorkshopWaitlist in src/lib/leads.ts).
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
