import { describe, expect, it } from "vitest";
import { formatCents, parseCentsFromRands } from "@/lib/format";

describe("formatCents", () => {
  it.each<[number, string]>([
    [0, "R0.00"],
    [1, "R0.01"],
    [100, "R1.00"],
    [150, "R1.50"],
    [300000, "R3 000.00"],
    [1234567, "R12 345.67"],
  ])("formats %i cents as %s", (cents, expected) => {
    expect(formatCents(cents)).toBe(expected);
  });
});

describe("parseCentsFromRands", () => {
  it.each<[string, number | null]>([
    ["", null],
    ["abc", null],
    ["1.5", 150],
    ["1,50", 150],
    ["0", 0],
    ["150", 15000],
    ["12.34", 1234],
    ["1.15", 115],
    ["1.005", null],
  ])("parses %s as %s", (input, expected) => {
    expect(parseCentsFromRands(input)).toBe(expected);
  });
});
