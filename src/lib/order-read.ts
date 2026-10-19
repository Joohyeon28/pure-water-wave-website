import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export interface OrderItemRead {
  sku: string;
  name: string;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
}

export interface OrderRead {
  reference: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  fulfilment: string;
  delivery_address: string | null;
  notes: string | null;
  subtotal_cents: number;
  delivery_cents: number;
  total_cents: number;
  created_at: string;
  items: OrderItemRead[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isCents(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isNullableString(value: unknown): value is string | null | undefined {
  return value === null || value === undefined || typeof value === "string";
}

function parseItem(value: unknown): OrderItemRead | null {
  if (!isRecord(value)) {
    return null;
  }

  const { sku, name, quantity, unit_price_cents, line_total_cents } = value;

  if (!isNonEmptyString(sku)) return null;
  if (!isNonEmptyString(name)) return null;
  if (!isPositiveInteger(quantity)) return null;
  if (!isCents(unit_price_cents)) return null;
  if (!isCents(line_total_cents)) return null;

  return { sku, name, quantity, unit_price_cents, line_total_cents };
}

export function parseOrderRead(value: unknown): OrderRead {
  if (!isRecord(value)) {
    throw new Error("get_order_for_customer returned a non-object payload.");
  }

  const {
    reference,
    status,
    customer_name,
    customer_email,
    customer_phone,
    fulfilment,
    delivery_address,
    notes,
    subtotal_cents,
    delivery_cents,
    total_cents,
    created_at,
    items,
  } = value;

  if (!isNonEmptyString(reference)) {
    throw new Error("get_order_for_customer returned an invalid or missing reference.");
  }

  if (!isNonEmptyString(status)) {
    throw new Error("get_order_for_customer returned an invalid or missing status.");
  }

  if (typeof customer_name !== "string") {
    throw new Error("get_order_for_customer returned an invalid or missing customer_name.");
  }

  if (typeof customer_email !== "string") {
    throw new Error("get_order_for_customer returned an invalid or missing customer_email.");
  }

  if (typeof customer_phone !== "string") {
    throw new Error("get_order_for_customer returned an invalid or missing customer_phone.");
  }

  if (typeof fulfilment !== "string") {
    throw new Error("get_order_for_customer returned an invalid or missing fulfilment.");
  }

  if (!isNullableString(delivery_address)) {
    throw new Error("get_order_for_customer returned an invalid delivery_address.");
  }

  if (!isNullableString(notes)) {
    throw new Error("get_order_for_customer returned invalid notes.");
  }

  if (!isCents(subtotal_cents)) {
    throw new Error("get_order_for_customer returned an invalid or missing subtotal_cents.");
  }

  if (!isCents(delivery_cents)) {
    throw new Error("get_order_for_customer returned an invalid or missing delivery_cents.");
  }

  if (!isCents(total_cents)) {
    throw new Error("get_order_for_customer returned an invalid or missing total_cents.");
  }

  if (typeof created_at !== "string" || created_at.length === 0) {
    throw new Error("get_order_for_customer returned an invalid or missing created_at.");
  }

  if (!Array.isArray(items)) {
    throw new Error("get_order_for_customer returned an invalid or missing items array.");
  }

  const parsedItems: OrderItemRead[] = [];

  for (const entry of items) {
    const item = parseItem(entry);

    if (!item) {
      throw new Error("get_order_for_customer returned an invalid order item.");
    }

    parsedItems.push(item);
  }

  return {
    reference,
    status,
    customer_name,
    customer_email,
    customer_phone,
    fulfilment,
    delivery_address: delivery_address ?? null,
    notes: notes ?? null,
    subtotal_cents,
    delivery_cents,
    total_cents,
    created_at,
    items: parsedItems,
  };
}

export async function fetchOrder(
  client: SupabaseClient<Database>,
  reference: string,
  email: string,
): Promise<OrderRead> {
  const { data, error } = await client.rpc("get_order_for_customer", {
    p_reference: reference,
    p_email: email,
  });

  if (error) {
    throw new Error(error.message);
  }

  return parseOrderRead(data);
}
