-- ============================================================
-- orders.payment_method
--
-- Records how an order was paid. Null for online orders until the
-- payment webhook sets it to 'online' (Phase 6). POS sales set it
-- directly through create_order.
-- ============================================================

alter table public.orders
  add column if not exists payment_method text
  check (payment_method is null or payment_method in ('cash','card','eft','online'));

comment on column public.orders.payment_method is
  'How the customer paid. Null for online orders until the payment webhook sets it to ''online''. Set directly for POS sales.';

-- ============================================================
-- REQUIRED FOLLOW-UP: create_order must accept and store it.
--
-- The create_order body lives only in the database (it is not tracked
-- in this repo), so it cannot be replaced here without clobbering the
-- existing order-creation logic. In the SQL Editor, update
-- create_order:
--
--   1. Add the parameter, keeping the existing defaults intact:
--        p_payment_method text default null
--
--   2. Add it to the INSERT column list and the VALUES list:
--        payment_method   -- column list
--        p_payment_method -- values list
--
--   3. Re-run the function so the new signature is registered.
--
-- Paste the current create_order definition here and this migration
-- can be rewritten as a full `create or replace function`.
-- ============================================================
