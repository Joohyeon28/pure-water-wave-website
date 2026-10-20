-- ============================================================
-- loyalty_enquiries
--
-- Stores enrolments for the combined Loyalty Programme:
--   enquiry_type = 'cooler'      -> 12-month cooler contract
--   enquiry_type = 'refill_20l'  -> 20L refill rewards (buy 3, get 1 free)
--
-- Public visitors may submit an enquiry; only admins may read them.
-- ============================================================

create table if not exists public.loyalty_enquiries (
  id uuid primary key default gen_random_uuid(),
  enquiry_type text not null check (enquiry_type in ('cooler', 'refill_20l')),
  name text not null,
  surname text not null,
  address text not null,
  contact_number text not null,
  reference_number text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

comment on column public.loyalty_enquiries.enquiry_type is
  'Which programme the customer enrolled in: cooler contract or 20L refill rewards.';

create index if not exists loyalty_enquiries_created_at_idx
  on public.loyalty_enquiries (created_at desc);

alter table public.loyalty_enquiries enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'loyalty_enquiries'
      and policyname = 'loyalty_enquiries_anon_insert'
  ) then
    create policy "loyalty_enquiries_anon_insert"
      on public.loyalty_enquiries
      for insert
      to anon, authenticated
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'loyalty_enquiries'
      and policyname = 'loyalty_enquiries_admin_select'
  ) then
    create policy "loyalty_enquiries_admin_select"
      on public.loyalty_enquiries
      for select
      to authenticated
      using (public.has_role(auth.uid(), 'admin'));
  end if;
end
$$;
