import { createHash, randomBytes } from "node:crypto";

const verificationLifetimeMs = 24 * 60 * 60 * 1000;

export function hashEmailVerificationToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createEmailVerificationToken(now = new Date()) {
  const token = randomBytes(32).toString("base64url");
  return {
    token,
    tokenHash: hashEmailVerificationToken(token),
    expiresAt: new Date(now.getTime() + verificationLifetimeMs),
  };
}

export function isVerificationExpired(expiresAt: Date, now = new Date()) {
  return expiresAt.getTime() <= now.getTime();
}
