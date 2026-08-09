import { describe, expect, it } from "vitest";
import { createEmailVerificationToken, hashEmailVerificationToken, isVerificationExpired } from "./email-verification";

describe("email verification tokens", () => {
  it("stores a hash and expires a new link after 24 hours", () => {
    const now = new Date("2026-08-09T12:00:00.000Z");
    const result = createEmailVerificationToken(now);
    expect(result.token.length).toBeGreaterThanOrEqual(43);
    expect(result.tokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect(result.tokenHash).not.toBe(result.token);
    expect(result.tokenHash).toBe(hashEmailVerificationToken(result.token));
    expect(result.expiresAt.toISOString()).toBe("2026-08-10T12:00:00.000Z");
  });

  it("treats the exact expiry instant as expired", () => {
    const expiresAt = new Date("2026-08-10T12:00:00.000Z");
    expect(isVerificationExpired(expiresAt, new Date("2026-08-10T11:59:59.999Z"))).toBe(false);
    expect(isVerificationExpired(expiresAt, new Date("2026-08-10T12:00:00.000Z"))).toBe(true);
  });
});
