import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export interface CreateOrderItem {
  productId: string;
  quantity: number;
}

export interface CreateOrderCustomer {
  name: string;
  email: string;
  phone: string;
  fulfilment: "delivery" | "pickup";
  deliveryAddress?: string;
  notes?: string;
  channel?: "online" | "in_store";
  markPaid?: boolean;
  paymentMethod?: "cash" | "card" | "eft" | "online";
}

export interface CreatedOrder {
  id: string;
  reference: string;
  subtotal_cents: number;
  delivery_cents: number;
  total_cents: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCents(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

export function parseCreatedOrder(value: unknown): CreatedOrder {
  if (!isRecord(value)) {
    throw new Error("create_order returned a non-object payload.");
  }

  const { id, reference, subtotal_cents, delivery_cents, total_cents } = value;

  if (typeof id !== "string" || id.length === 0) {
    throw new Error("create_order returned an invalid or missing id.");
  }

  if (typeof reference !== "string" || reference.length === 0) {
    throw new Error("create_order returned an invalid or missing reference.");
  }

  if (!isCents(subtotal_cents)) {
    throw new Error("create_order returned an invalid or missing subtotal_cents.");
  }

  if (!isCents(delivery_cents)) {
    throw new Error("create_order returned an invalid or missing delivery_cents.");
  }

  if (!isCents(total_cents)) {
    throw new Error("create_order returned an invalid or missing total_cents.");
  }

  return { id, reference, subtotal_cents, delivery_cents, total_cents };
}

export async function createOrder(
  client: SupabaseClient<Database>,
  items: CreateOrderItem[],
  customer: CreateOrderCustomer,
): Promise<CreatedOrder> {
  const { data, error } = await client.rpc("create_order", {
    p_items: items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
    p_customer: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      fulfilment: customer.fulfilment,
      delivery_address: customer.deliveryAddress,
      notes: customer.notes,
      channel: customer.channel ?? "online",
    },
    p_mark_paid: customer.markPaid ?? false,
    p_payment_method: customer.paymentMethod ?? null,
  });

  if (error) {
    throw new Error(error.message);
  }

  return parseCreatedOrder(data);
}
