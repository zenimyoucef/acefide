import { afterEach, describe, expect, it } from "vitest";
import { buildVerificationUrl } from "./verification-email";

describe("verification email URL", () => {
  afterEach(() => delete process.env.NEXT_PUBLIC_APP_URL);

  it("preserves locale and safely encodes the token", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://example.test";
    expect(buildVerificationUrl("a+b/c", "fr")).toBe("https://example.test/api/auth/verify-email?token=a%2Bb%2Fc&locale=fr");
  });

  it("rejects missing application URL configuration", () => {
    expect(() => buildVerificationUrl("token", "en")).toThrow("NEXT_PUBLIC_APP_URL");
  });
});
