CREATE TYPE "organization_role" AS ENUM ('owner', 'admin', 'clinician', 'member');

CREATE TABLE "organization" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "organization_membership" (
  "id" text PRIMARY KEY NOT NULL,
  "organizationId" text NOT NULL REFERENCES "organization"("id") ON DELETE CASCADE,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "role" "organization_role" NOT NULL DEFAULT 'member',
  "createdAt" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "organization_membership_org_user_unique" UNIQUE ("organizationId", "userId")
);
CREATE INDEX "organization_membership_user_idx" ON "organization_membership" ("userId");

CREATE TABLE "patient" (
  "id" text PRIMARY KEY NOT NULL,
  "ownerUserId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "displayName" text NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX "patient_owner_user_idx" ON "patient" ("ownerUserId");

CREATE TABLE "patient_membership" (
  "id" text PRIMARY KEY NOT NULL,
  "patientId" text NOT NULL REFERENCES "patient"("id") ON DELETE CASCADE,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "patient_membership_patient_user_unique" UNIQUE ("patientId", "userId")
);
CREATE INDEX "patient_membership_user_idx" ON "patient_membership" ("userId");
