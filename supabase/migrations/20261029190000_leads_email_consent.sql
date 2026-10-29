-- Email delivery and marketing consent for leads (src/lib/leads.ts,
-- src/lib/email/*). The starter list itself is sent to everyone who asks
-- for it; newsletters only to rows with marketing_consent = true.

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
