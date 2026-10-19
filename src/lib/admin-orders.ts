import type { Tables } from "@/types/supabase";

export interface AdminOrderRow extends Tables<"orders"> {
  item_count: number;
}

export interface AdminOrderDetail extends Tables<"orders"> {
  items: Tables<"order_items">[];
}

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "fulfilled"
  | "cancelled"
  | "refunded";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending_payment",
  "paid",
  "fulfilled",
  "cancelled",
  "refunded",
];

export function canMarkPaid(status: string): boolean {
  return status === "pending_payment";
}

export function canMarkFulfilled(status: string): boolean {
  return status === "paid";
}

export function canCancel(status: string): boolean {
  return status === "pending_payment" || status === "paid";
}

export function canRefund(status: string): boolean {
  return status === "paid" || status === "fulfilled";
}

export function statusLabel(status: string): string {
  switch (status) {
    case "pending_payment":
      return "Pending payment";
    case "paid":
      return "Paid";
    case "fulfilled":
      return "Fulfilled";
    case "cancelled":
      return "Cancelled";
    case "refunded":
      return "Refunded";
    default:
      return status.length > 0
        ? status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ")
        : "Unknown";
  }
}

export function sanitiseSearchTerm(input: string): string {
  return input.replace(/[,()]/g, " ").replace(/\s+/g, " ").trim();
}

export function statusVariant(
  status: string,
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "paid":
      return "default";
    case "fulfilled":
      return "secondary";
    case "cancelled":
    case "refunded":
      return "destructive";
    case "pending_payment":
    default:
      return "outline";
  }
}
