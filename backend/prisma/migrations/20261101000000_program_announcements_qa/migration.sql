CREATE TYPE "ProgramMessageType" AS ENUM ('ANNOUNCEMENT', 'QUESTION', 'REPLY');

CREATE TABLE "ProgramMessage" (
    "id" TEXT NOT NULL,
    "type" "ProgramMessageType" NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "programId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ProgramMessage_programId_type_createdAt_idx" ON "ProgramMessage"("programId", "type", "createdAt");
CREATE INDEX "ProgramMessage_parentId_createdAt_idx" ON "ProgramMessage"("parentId", "createdAt");

ALTER TABLE "ProgramMessage" ADD CONSTRAINT "ProgramMessage_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProgramMessage" ADD CONSTRAINT "ProgramMessage_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProgramMessage" ADD CONSTRAINT "ProgramMessage_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ProgramMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
