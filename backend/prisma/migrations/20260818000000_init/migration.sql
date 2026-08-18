-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MENTOR', 'STUDENT');
CREATE TYPE "ProgramStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');
CREATE TYPE "LessonType" AS ENUM ('VIDEO', 'ARTICLE', 'LIVE', 'ASSIGNMENT');
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'DROPPED');
CREATE TYPE "AssignmentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED');
CREATE TYPE "SubmissionStatus" AS ENUM ('SUBMITTED', 'REVIEWED', 'RETURNED');
CREATE TYPE "SessionStatus" AS ENUM ('SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED');
CREATE TYPE "LessonProgressStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL, "name" TEXT NOT NULL, "email" TEXT NOT NULL,
    "password" TEXT NOT NULL, "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "avatar" TEXT, "bio" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL, "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isApproved" BOOLEAN NOT NULL DEFAULT true, CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Program" (
    "id" TEXT NOT NULL, "title" TEXT NOT NULL, "description" TEXT,
    "price" DECIMAL(10,2), "thumbnail" TEXT, "status" "ProgramStatus" NOT NULL DEFAULT 'DRAFT',
    "mentorId" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL, "title" TEXT NOT NULL, "content" TEXT,
    "type" "LessonType" NOT NULL DEFAULT 'ARTICLE', "order" INTEGER NOT NULL,
    "programId" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "programId" TEXT NOT NULL,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE', "progress" INTEGER NOT NULL DEFAULT 0,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "completedAt" TIMESTAMP(3),
    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL, "title" TEXT NOT NULL, "description" TEXT, "prompt" TEXT,
    "dueAt" TIMESTAMP(3), "status" "AssignmentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "programId" TEXT, "lessonId" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL, "content" TEXT, "fileUrl" TEXT, "grade" DOUBLE PRECISION,
    "feedback" TEXT, "status" "SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "reviewedAt" TIMESTAMP(3),
    "assignmentId" TEXT NOT NULL, "userId" TEXT NOT NULL, CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Session" (
    "id" TEXT NOT NULL, "title" TEXT NOT NULL, "notes" TEXT, "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3), "meetingUrl" TEXT, "status" "SessionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "mentorId" TEXT NOT NULL, "programId" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "LessonProgress" (
    "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "lessonId" TEXT NOT NULL,
    "status" "LessonProgressStatus" NOT NULL DEFAULT 'NOT_STARTED', "progress" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3), "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "_SessionAttendees" (
    "A" TEXT NOT NULL, "B" TEXT NOT NULL,
    CONSTRAINT "_SessionAttendees_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Lesson_programId_order_key" ON "Lesson"("programId", "order");
CREATE UNIQUE INDEX "Enrollment_userId_programId_key" ON "Enrollment"("userId", "programId");
CREATE UNIQUE INDEX "Submission_assignmentId_userId_key" ON "Submission"("assignmentId", "userId");
CREATE UNIQUE INDEX "LessonProgress_userId_lessonId_key" ON "LessonProgress"("userId", "lessonId");
CREATE INDEX "_SessionAttendees_B_index" ON "_SessionAttendees"("B");

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_SessionAttendees" ADD CONSTRAINT "_SessionAttendees_A_fkey" FOREIGN KEY ("A") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_SessionAttendees" ADD CONSTRAINT "_SessionAttendees_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
