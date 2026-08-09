import { afterEach, describe, expect, it } from "vitest";
import { membershipBlobAuth } from "./membership-blob";

const originalToken = process.env.BLOB_READ_WRITE_TOKEN;

afterEach(() => {
  if (originalToken === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
  else process.env.BLOB_READ_WRITE_TOKEN = originalToken;
});

describe("membershipBlobAuth", () => {
  it("lets the Blob SDK use Vercel OIDC when no legacy token exists", () => {
    delete process.env.BLOB_READ_WRITE_TOKEN;

    expect(membershipBlobAuth()).toEqual({});
  });

  it("keeps supporting an explicitly configured legacy token", () => {
    process.env.BLOB_READ_WRITE_TOKEN = "legacy-token";

    expect(membershipBlobAuth()).toEqual({ token: "legacy-token" });
  });
});
