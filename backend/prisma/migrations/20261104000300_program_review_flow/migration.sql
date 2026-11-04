ALTER TABLE "Program" ADD COLUMN "isApproved" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Program" ADD COLUMN "submittedForReview" BOOLEAN NOT NULL DEFAULT false;
UPDATE "Program" SET "isApproved" = true WHERE "status" = 'ACTIVE';
