CREATE TABLE IF NOT EXISTS "ConsultationRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "organization" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsultationRequest_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "ContactMessage"
ADD COLUMN IF NOT EXISTS "organization" TEXT;

ALTER TABLE "ContactMessage"
ADD COLUMN IF NOT EXISTS "read" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "ContactMessage"
ADD COLUMN IF NOT EXISTS "status" "RequestStatus" NOT NULL DEFAULT 'PENDING';
