CREATE TYPE "MembershipStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED_WAITING_PAYMENT', 'COMPLETED', 'REJECTED');

ALTER TABLE "MembershipRequest"
  ADD COLUMN "userId" TEXT,
  ADD COLUMN "approvedAt" TIMESTAMP(3),
  ADD COLUMN "rejectedAt" TIMESTAMP(3),
  ADD COLUMN "membershipStatus" "MembershipStatus" NOT NULL DEFAULT 'PENDING_REVIEW';

UPDATE "MembershipRequest"
SET "membershipStatus" = CASE "status"::TEXT
  WHEN 'COMPLETED' THEN 'COMPLETED'::"MembershipStatus"
  WHEN 'CANCELLED' THEN 'REJECTED'::"MembershipStatus"
  WHEN 'CONTACTED' THEN 'APPROVED_WAITING_PAYMENT'::"MembershipStatus"
  ELSE 'PENDING_REVIEW'::"MembershipStatus"
END;

ALTER TABLE "MembershipRequest" DROP COLUMN "status";
ALTER TABLE "MembershipRequest" RENAME COLUMN "membershipStatus" TO "status";
CREATE UNIQUE INDEX "MembershipRequest_userId_key" ON "MembershipRequest"("userId");
ALTER TABLE "MembershipRequest" ADD CONSTRAINT "MembershipRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "User"
  ADD COLUMN "activationTokenHash" TEXT,
  ADD COLUMN "activationExpiresAt" TIMESTAMP(3);
CREATE UNIQUE INDEX "User_activationTokenHash_key" ON "User"("activationTokenHash");
