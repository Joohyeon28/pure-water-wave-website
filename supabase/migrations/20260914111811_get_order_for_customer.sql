-- ============================================================
-- get_order_for_customer: read a single order by reference + email
--
-- The reference alone (EW-YYYY-NNNNN) is guessable, so we require the
-- customer's email to match as a weak authentication factor. This is
-- the standard e-commerce confirmation pattern.
--
-- Called as:
--   supabase.rpc('get_order_for_customer', {
--     p_reference: 'EW-2026-00001',
--     p_email: 'customer@example.com'
--   })
--
-- Returns jsonb { reference, status, customer_*, fulfilment, ..., items[] }
-- Raises P0002 ('Order not found') if reference + email don't match.
-- ============================================================

create or replace function public.get_order_for_customer(
  p_reference text,
  p_email     text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_items jsonb;
begin
  if p_reference is null or trim(p_reference) = '' then
    raise exception 'reference is required' using errcode = '22023';
  end if;
  if p_email is null or trim(p_email) = '' then
    raise exception 'email is required' using errcode = '22023';
  end if;

  select * into v_order
    from public.orders
   where reference = trim(p_reference)
     and lower(customer_email) = lower(trim(p_email));

  if not found then
    raise exception 'Order not found' using errcode = 'P0002';
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'sku',              oi.sku,
        'name',             oi.name,
        'quantity',         oi.quantity,
        'unit_price_cents', oi.unit_price_cents,
        'line_total_cents', oi.line_total_cents
      )
      order by oi.created_at
    ),
    '[]'::jsonb
  )
  into v_items
  from public.order_items oi
  where oi.order_id = v_order.id;

  return jsonb_build_object(
    'reference',        v_order.reference,
    'status',           v_order.status,
    'customer_name',    v_order.customer_name,
    'customer_email',   v_order.customer_email,
    'customer_phone',   v_order.customer_phone,
    'fulfilment',       v_order.fulfilment,
    'delivery_address', v_order.delivery_address,
    'notes',            v_order.notes,
    'subtotal_cents',   v_order.subtotal_cents,
    'delivery_cents',   v_order.delivery_cents,
    'total_cents',      v_order.total_cents,
    'created_at',       v_order.created_at,
    'items',            v_items
  );
end;
$$;

revoke all on function public.get_order_for_customer(text, text) from public;
grant execute on function public.get_order_for_customer(text, text) to anon, authenticated;
