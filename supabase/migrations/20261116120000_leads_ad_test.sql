-- Paid-ad test of three lead magnets (/free/small-shop, /free/first-client,
-- /free/kitchen-checklist) and the course waitlist (/course).
-- Additive only: new allowed values and new columns, nothing removed.

-- 1. New lead sources: one per ad landing page + the course waitlist.
alter table public.leads drop constraint if exists leads_source_check;
alter table public.leads
  add constraint leads_source_check
  check (source in (
    'starter-list', 'workshop-pricing',
    'ad-build', 'ad-paid', 'ad-kitchen', 'course-waitlist'
  ));

-- 2. New paths: the page the form was on.
alter table public.leads drop constraint if exists leads_path_check;
alter table public.leads
  add constraint leads_path_check
  check (path in (
    'home', 'shop', 'general', 'workshop', 'start',
    'free-small-shop', 'free-first-client', 'free-kitchen-checklist', 'course'
  ));

-- 3. Ad refs (?ref=ad-1|ad-2|ad-3), next to the social ones.
alter table public.leads drop constraint if exists leads_ref_check;
alter table public.leads
  add constraint leads_ref_check
  check (ref is null or ref in ('ig', 'tt', 'yt', 'ad-1', 'ad-2', 'ad-3'));

alter table public.leads
  -- 4. Course waitlist flag ("Furniture Without a Big Shop"). Set on every
  -- row of an email that joins on /course; a new 'course-waitlist' row is
  -- only created for an email that isn't in leads yet.
  add column if not exists course_waitlist boolean not null default false,
  add column if not exists course_waitlist_at timestamptz,
  -- 5. Random secret for /free/thanks?l=… (same shape as unsubscribe_token,
  -- but a separate value, so the page URL can't be used to unsubscribe).
  -- The offer checkout looks the lead up by it to attribute the purchase
  -- and prefill the email in Stripe, server-side.
  add column if not exists offer_token text not null
    default replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');

create unique index if not exists leads_offer_token_key
  on public.leads (offer_token);

notify pgrst, 'reload schema';
