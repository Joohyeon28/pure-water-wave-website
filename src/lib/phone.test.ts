import { describe, expect, it } from "vitest";
import { normaliseSaPhone } from "@/lib/phone";

describe("normaliseSaPhone", () => {
  it("accepts a local mobile number with a leading zero", () => {
    expect(normaliseSaPhone("0630841172")).toBe("630841172");
    expect(normaliseSaPhone("082 000 0000")).toBe("820000000");
  });

  it("accepts a number without the leading zero", () => {
    expect(normaliseSaPhone("630841172")).toBe("630841172");
  });

  it("accepts the +27 country code", () => {
    expect(normaliseSaPhone("+27 63 084 1172")).toBe("630841172");
    expect(normaliseSaPhone("27 63 084 1172")).toBe("630841172");
    expect(normaliseSaPhone("0027 63 084 1172")).toBe("630841172");
  });

  it("accepts landline numbers", () => {
    expect(normaliseSaPhone("011 234 5678")).toBe("112345678");
    expect(normaliseSaPhone("021 555 1234")).toBe("215551234");
  });

  it("rejects numbers of the wrong length", () => {
    expect(normaliseSaPhone("12345")).toBeNull();
    expect(normaliseSaPhone("063084117")).toBeNull();
    expect(normaliseSaPhone("06308411720")).toBeNull();
  });

  it("rejects empty or non-numeric input", () => {
    expect(normaliseSaPhone("")).toBeNull();
    expect(normaliseSaPhone("abc")).toBeNull();
    expect(normaliseSaPhone("+27")).toBeNull();
  });

  it("rejects numbers that do not start with a valid SA prefix", () => {
    expect(normaliseSaPhone("0999999999")).toBeNull();
  });
});
