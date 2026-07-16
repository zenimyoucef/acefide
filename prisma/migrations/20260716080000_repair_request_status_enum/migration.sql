DO $$
BEGIN
    CREATE TYPE "RequestStatus" AS ENUM (
        'PENDING',
        'CONTACTED',
        'COMPLETED',
        'CANCELLED'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'MembershipRequest'
          AND column_name = 'status'
    ) THEN
        ALTER TABLE "MembershipRequest"
        ALTER COLUMN "status" DROP DEFAULT;

        ALTER TABLE "MembershipRequest"
        ALTER COLUMN "status" TYPE "RequestStatus"
        USING (
            CASE UPPER(COALESCE("status"::TEXT, 'PENDING'))
                WHEN 'CONTACTED' THEN 'CONTACTED'::"RequestStatus"
                WHEN 'COMPLETED' THEN 'COMPLETED'::"RequestStatus"
                WHEN 'CANCELLED' THEN 'CANCELLED'::"RequestStatus"
                ELSE 'PENDING'::"RequestStatus"
            END
        );

        ALTER TABLE "MembershipRequest"
        ALTER COLUMN "status" SET DEFAULT 'PENDING',
        ALTER COLUMN "status" SET NOT NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'ContactMessage'
          AND column_name = 'status'
    ) THEN
        ALTER TABLE "ContactMessage"
        ALTER COLUMN "status" DROP DEFAULT;

        ALTER TABLE "ContactMessage"
        ALTER COLUMN "status" TYPE "RequestStatus"
        USING (
            CASE UPPER(COALESCE("status"::TEXT, 'PENDING'))
                WHEN 'CONTACTED' THEN 'CONTACTED'::"RequestStatus"
                WHEN 'COMPLETED' THEN 'COMPLETED'::"RequestStatus"
                WHEN 'CANCELLED' THEN 'CANCELLED'::"RequestStatus"
                ELSE 'PENDING'::"RequestStatus"
            END
        );

        ALTER TABLE "ContactMessage"
        ALTER COLUMN "status" SET DEFAULT 'PENDING',
        ALTER COLUMN "status" SET NOT NULL;
    END IF;
END $$;
