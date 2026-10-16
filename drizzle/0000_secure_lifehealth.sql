CREATE TABLE IF NOT EXISTS "user" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL UNIQUE,
  "emailVerified" boolean NOT NULL DEFAULT false,
  "image" text,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "session" (
  "id" text PRIMARY KEY NOT NULL,
  "expiresAt" timestamp NOT NULL,
  "token" text NOT NULL UNIQUE,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL,
  "ipAddress" text,
  "userAgent" text,
  "userId" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "account" (
  "id" text PRIMARY KEY NOT NULL,
  "accountId" text NOT NULL,
  "providerId" text NOT NULL,
  "userId" text NOT NULL,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamp,
  "refreshTokenExpiresAt" timestamp,
  "scope" text,
  "password" text,
  "createdAt" timestamp NOT NULL,
  "updatedAt" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "verification" (
  "id" text PRIMARY KEY NOT NULL,
  "identifier" text NOT NULL,
  "value" text NOT NULL,
  "expiresAt" timestamp NOT NULL,
  "createdAt" timestamp,
  "updatedAt" timestamp
);

CREATE TABLE IF NOT EXISTS "audit_event" (
  "id" text PRIMARY KEY NOT NULL,
  "userId" text NOT NULL,
  "action" text NOT NULL,
  "resourceType" text NOT NULL,
  "resourceId" text,
  "ipAddress" text,
  "userAgent" text,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "health_record" (
  "id" text PRIMARY KEY NOT NULL,
  "userId" text NOT NULL,
  "title" text NOT NULL,
  "recordType" text NOT NULL,
  "storagePath" text,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "consent_grant" (
  "id" text PRIMARY KEY NOT NULL,
  "patientId" text NOT NULL,
  "doctorId" text NOT NULL,
  "scope" text NOT NULL,
  "status" text NOT NULL DEFAULT 'active',
  "expiresAt" timestamp,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "revokedAt" timestamp
);

CREATE TABLE IF NOT EXISTS "notification" (
  "id" text PRIMARY KEY NOT NULL,
  "userId" text NOT NULL,
  "kind" text NOT NULL,
  "title" text NOT NULL,
  "body" text NOT NULL,
  "readAt" timestamp,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "rate_limit_bucket" (
  "key" text PRIMARY KEY NOT NULL,
  "count" integer NOT NULL DEFAULT 0,
  "windowStartedAt" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "session" ("userId");
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "account" ("userId");
CREATE INDEX IF NOT EXISTS "audit_event_user_created_idx" ON "audit_event" ("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "health_record_user_created_idx" ON "health_record" ("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "consent_patient_status_idx" ON "consent_grant" ("patientId", "status");
CREATE INDEX IF NOT EXISTS "consent_doctor_status_idx" ON "consent_grant" ("doctorId", "status");
CREATE INDEX IF NOT EXISTS "notification_user_read_idx" ON "notification" ("userId", "readAt", "createdAt");

DO $$ BEGIN
  ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "audit_event" ADD CONSTRAINT "audit_event_user_id_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "health_record" ADD CONSTRAINT "health_record_user_id_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "consent_grant" ADD CONSTRAINT "consent_patient_id_user_id_fk" FOREIGN KEY ("patientId") REFERENCES "user"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "consent_grant" ADD CONSTRAINT "consent_doctor_id_user_id_fk" FOREIGN KEY ("doctorId") REFERENCES "user"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
