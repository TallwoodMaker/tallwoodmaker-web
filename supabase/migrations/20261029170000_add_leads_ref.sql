-- Where a lead came from: the ?ref= value of the visit that led to the
-- signup ('ig', 'tt' or 'yt'), kept for 30 days in the twm_ref cookie
-- (src/proxy.ts) and written by src/lib/leads.ts. Null = no ref.
alter table public.leads add column if not exists ref text;

alter table public.leads drop constraint if exists leads_ref_check;
alter table public.leads
  add constraint leads_ref_check check (ref is null or ref in ('ig', 'tt', 'yt'));
