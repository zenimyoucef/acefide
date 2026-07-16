-- Repair databases that were baselined before the User.active field existed.
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "active" BOOLEAN NOT NULL DEFAULT true;
