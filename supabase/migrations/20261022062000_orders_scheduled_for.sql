-- ============================================================
-- orders.scheduled_for
--
-- Requested pickup or delivery date/time. Stored as timestamptz.
-- ============================================================

alter table public.orders
  add column if not exists scheduled_for timestamptz;

comment on column public.orders.scheduled_for is
  'Requested pickup or delivery date and time, stored in UTC.';

-- ============================================================
-- REQUIRED FOLLOW-UP: create_order must store it.
--
-- The create_order body lives only in the database (it is not tracked
-- in this repo). In the SQL Editor, update create_order:
--
--   1. Add `scheduled_for` to the INSERT column list.
--   2. Add this to the VALUES list:
--        nullif(p_customer->>'scheduled_for','')::timestamptz
--
-- The client sends the value inside p_customer as `scheduled_for`
-- (an ISO 8601 string), so no RPC signature change is required.
-- Until this is applied, orders are still created; the requested
-- schedule is simply not persisted.
-- ============================================================
