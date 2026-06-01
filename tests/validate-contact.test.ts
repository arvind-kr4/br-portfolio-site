import { describe, it, expect } from "vitest";
import { validateContact } from "@/lib/validate-contact";

describe("validateContact", () => {
  it("accepts a valid payload", () => {
    const r = validateContact({ name: "Jo", email: "jo@x.com", message: "Hello there" });
    expect(r.ok).toBe(true);
  });

  it("rejects a missing name", () => {
    const r = validateContact({ name: "", email: "jo@x.com", message: "Hello there" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.name).toBeDefined();
  });

  it("rejects a bad email", () => {
    const r = validateContact({ name: "Jo", email: "nope", message: "Hello there" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.email).toBeDefined();
  });

  it("rejects a too-short message", () => {
    const r = validateContact({ name: "Jo", email: "jo@x.com", message: "hi" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.message).toBeDefined();
  });

  it("rejects non-object input", () => {
    const r = validateContact(null);
    expect(r.ok).toBe(false);
  });
});
