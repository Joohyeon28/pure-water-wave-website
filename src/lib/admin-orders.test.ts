import { describe, expect, it } from "vitest";
import {
  ORDER_STATUSES,
  canCancel,
  canMarkFulfilled,
  canMarkPaid,
  canRefund,
  sanitiseSearchTerm,
  statusLabel,
  statusVariant,
} from "@/lib/admin-orders";
import type { OrderStatus } from "@/lib/admin-orders";

interface GuardExpectation {
  canMarkPaid: boolean;
  canMarkFulfilled: boolean;
  canCancel: boolean;
  canRefund: boolean;
}

const guardExpectations: Record<OrderStatus, GuardExpectation> = {
  pending_payment: {
    canMarkPaid: true,
    canMarkFulfilled: false,
    canCancel: true,
    canRefund: false,
  },
  paid: {
    canMarkPaid: false,
    canMarkFulfilled: true,
    canCancel: true,
    canRefund: true,
  },
  fulfilled: {
    canMarkPaid: false,
    canMarkFulfilled: false,
    canCancel: false,
    canRefund: true,
  },
  cancelled: {
    canMarkPaid: false,
    canMarkFulfilled: false,
    canCancel: false,
    canRefund: false,
  },
  refunded: {
    canMarkPaid: false,
    canMarkFulfilled: false,
    canCancel: false,
    canRefund: false,
  },
};

describe("order status guards", () => {
  it("exposes the five known statuses", () => {
    expect(ORDER_STATUSES).toEqual([
      "pending_payment",
      "paid",
      "fulfilled",
      "cancelled",
      "refunded",
    ]);
  });

  it.each(Object.keys(guardExpectations) as OrderStatus[])(
    "matches every guard for %s",
    (status) => {
      const expected = guardExpectations[status];

      expect(canMarkPaid(status)).toBe(expected.canMarkPaid);
      expect(canMarkFulfilled(status)).toBe(expected.canMarkFulfilled);
      expect(canCancel(status)).toBe(expected.canCancel);
      expect(canRefund(status)).toBe(expected.canRefund);
    },
  );

  it("denies every transition for an unknown status", () => {
    expect(canMarkPaid("something_else")).toBe(false);
    expect(canMarkFulfilled("something_else")).toBe(false);
    expect(canCancel("something_else")).toBe(false);
    expect(canRefund("something_else")).toBe(false);
    expect(canMarkPaid("")).toBe(false);
  });

  it("only allows refunds from paid or fulfilled", () => {
    const refundable = ORDER_STATUSES.filter((status) => canRefund(status));

    expect(refundable).toEqual(["paid", "fulfilled"]);
  });

  it("only allows cancellation from pending_payment or paid", () => {
    const cancellable = ORDER_STATUSES.filter((status) => canCancel(status));

    expect(cancellable).toEqual(["pending_payment", "paid"]);
  });
});

describe("statusLabel", () => {
  it("labels every known status", () => {
    expect(statusLabel("pending_payment")).toBe("Pending payment");
    expect(statusLabel("paid")).toBe("Paid");
    expect(statusLabel("fulfilled")).toBe("Fulfilled");
    expect(statusLabel("cancelled")).toBe("Cancelled");
    expect(statusLabel("refunded")).toBe("Refunded");
  });

  it("humanises an unknown status", () => {
    expect(statusLabel("awaiting_stock")).toBe("Awaiting stock");
    expect(statusLabel("")).toBe("Unknown");
  });
});

describe("sanitiseSearchTerm", () => {
  it("replaces a comma with a single space", () => {
    expect(sanitiseSearchTerm("Smith, John")).toBe("Smith John");
  });

  it("replaces parentheses with spaces", () => {
    expect(sanitiseSearchTerm("a)b(c")).toBe("a b c");
  });

  it("returns an empty string for empty input", () => {
    expect(sanitiseSearchTerm("")).toBe("");
  });

  it("returns an empty string for whitespace-only input", () => {
    expect(sanitiseSearchTerm("   ")).toBe("");
    expect(sanitiseSearchTerm(" ,() ")).toBe("");
    expect(sanitiseSearchTerm(",()")).toBe("");
  });

  it("leaves a normal search term unchanged", () => {
    expect(sanitiseSearchTerm("EW-2026-00001")).toBe("EW-2026-00001");
    expect(sanitiseSearchTerm("jane@example.com")).toBe("jane@example.com");
    expect(sanitiseSearchTerm("Protea Glen")).toBe("Protea Glen");
  });
});

describe("statusVariant", () => {
  it("maps every known status to a badge variant", () => {
    expect(statusVariant("pending_payment")).toBe("outline");
    expect(statusVariant("paid")).toBe("default");
    expect(statusVariant("fulfilled")).toBe("secondary");
    expect(statusVariant("cancelled")).toBe("destructive");
    expect(statusVariant("refunded")).toBe("destructive");
  });

  it("falls back to outline for an unknown status", () => {
    expect(statusVariant("something_else")).toBe("outline");
    expect(statusVariant("")).toBe("outline");
  });
});
