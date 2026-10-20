-- ============================================================
-- Products price list
--
-- Seeds the published "Our Prices" list from the 18.10.2026 design:
--   Refills:  Purified R1.00/L, Alkaline R1.50/L, 100% Fruit Juice R15/L
--   Bottled:  330ml (juice only), 500ml, 1.5Lt, 5Lt
--
-- Idempotent: matches on products.sku and updates the price/unit/name.
-- The frontend stays DB-driven; these rows are the price authority.
-- ============================================================

insert into public.products (sku, name, category, unit, price_cents, active, sort_order)
values
  ('purified_refill',      'Purified Water',              'refill', 'litre',  100,  true, 10),
  ('alkaline_refill',      'Alkaline Water',              'refill', 'litre',  150,  true, 11),
  ('fruit_juice_refill',   '100% Fruit Juice',            'refill', 'litre',  1500, true, 12),

  ('fruit_juice_330ml',    '100% Fruit Juice 330ml',      'juice',  '330ml',  1000, true, 20),

  ('purified_500ml',       'Purified Water 500ml',        'bottle', '500ml',  1000, true, 30),
  ('alkaline_500ml',       'Alkaline Water 500ml',        'bottle', '500ml',  1500, true, 31),
  ('fruit_juice_500ml',    '100% Fruit Juice 500ml',      'juice',  '500ml',  1500, true, 32),

  ('purified_1.5l',        'Purified Water 1.5L',         'bottle', '1.5L',   1500, true, 40),
  ('alkaline_1.5l',        'Alkaline Water 1.5L',         'bottle', '1.5L',   2500, true, 41),
  ('fruit_juice_1.5l',     '100% Fruit Juice 1.5L',       'juice',  '1.5L',   3000, true, 42),

  ('purified_5l',          'Purified Water 5L',           'bottle', '5L',     2500, true, 50),
  ('alkaline_5l',          'Alkaline Water 5L',           'bottle', '5L',     4000, true, 51),
  ('fruit_juice_5l',       '100% Fruit Juice 5L',         'juice',  '5L',     8000, true, 52)
on conflict (sku) do update set
  name = excluded.name,
  category = excluded.category,
  unit = excluded.unit,
  price_cents = excluded.price_cents,
  active = excluded.active,
  sort_order = excluded.sort_order,
  updated_at = now();
