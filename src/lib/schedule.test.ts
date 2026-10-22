import { describe, expect, it } from "vitest";
import { isFutureDateTime, toLocalDateInputValue } from "@/lib/schedule";

const now = new Date("2026-10-22T12:00:00");

describe("isFutureDateTime", () => {
  it("accepts a later time today", () => {
    expect(isFutureDateTime("2026-10-22", "13:30", now)).toBe(true);
  });

  it("accepts a future date", () => {
    expect(isFutureDateTime("2026-10-25", "09:00", now)).toBe(true);
  });

  it("rejects the current minute", () => {
    expect(isFutureDateTime("2026-10-22", "12:00", now)).toBe(false);
  });

  it("rejects a past time today", () => {
    expect(isFutureDateTime("2026-10-22", "09:00", now)).toBe(false);
  });

  it("rejects a past date", () => {
    expect(isFutureDateTime("2026-10-21", "18:00", now)).toBe(false);
  });

  it("rejects invalid input", () => {
    expect(isFutureDateTime("", "10:00", now)).toBe(false);
    expect(isFutureDateTime("2026-10-22", "", now)).toBe(false);
    expect(isFutureDateTime("not-a-date", "10:00", now)).toBe(false);
  });
});

describe("toLocalDateInputValue", () => {
  it("formats a date as YYYY-MM-DD in local time", () => {
    expect(toLocalDateInputValue(new Date("2026-01-05T12:00:00"))).toBe("2026-01-05");
    expect(toLocalDateInputValue(new Date("2026-12-31T23:59:00"))).toBe("2026-12-31");
  });
});
