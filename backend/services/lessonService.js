const prisma = require('../prisma/client');
const { learnerEnrollmentWhere } = require('./enrollmentAccess');

const createLesson = async (programId, userId, { title, content, topic, type, order: reqOrder }) => {
  const existingProgram = await prisma.program.findUnique({
    where: { id: programId },
  });

  if (!existingProgram) {
    const error = new Error('Program not found');
    error.statusCode = 404;
    throw error;
  }

  if (existingProgram.mentorId !== userId) {
    const error = new Error('Forbidden: You do not own this program');
    error.statusCode = 403;
    throw error;
  }

  let order = reqOrder;
  if (order === undefined || order === null) {
    const maxLesson = await prisma.lesson.findFirst({
      where: { programId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    order = maxLesson ? maxLesson.order + 1 : 1;
  }

  return await prisma.lesson.create({
    data: {
      title,
      content: content || null,
      topic: topic?.trim() || null,
      type: type || 'ARTICLE',
      order,
      programId,
    },
  });
};

const getLessonsByProgramId = async (programId, user) => {
  const existingProgram = await prisma.program.findUnique({
    where: { id: programId },
  });

  if (!existingProgram) {
    const error = new Error('Program not found');
    error.statusCode = 404;
    throw error;
  }

  if (existingProgram.status !== 'ACTIVE' && user?.role !== 'ADMIN' && existingProgram.mentorId !== user?.id) {
    const error = new Error('Program not found'); error.statusCode = 404; throw error;
  }
  const enrolled = user && await prisma.enrollment.findFirst({ where: learnerEnrollmentWhere(user.id, programId), select: { id: true } });
  const canReadContent = user?.role === 'ADMIN' || existingProgram.mentorId === user?.id || Boolean(enrolled);
  return await prisma.lesson.findMany({
    where: { programId },
    orderBy: { order: 'asc' },
    ...(canReadContent ? {} : { select: { id: true, title: true, topic: true, type: true, order: true, programId: true } }),
  });
};

const deleteLesson = async (lessonId, mentorId) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { program: { select: { mentorId: true } } },
  });

  if (!lesson) {
    const error = new Error('Lesson not found');
    error.statusCode = 404;
    throw error;
  }

  if (lesson.program.mentorId !== mentorId) {
    const error = new Error('Forbidden: You do not own this lesson');
    error.statusCode = 403;
    throw error;
  }

  await prisma.$transaction(async (tx) => {
    await tx.lesson.delete({ where: { id: lessonId } });
    await tx.$executeRaw`
      WITH lesson_totals AS (
        SELECT COUNT(*)::int AS total FROM "Lesson" WHERE "programId" = ${lesson.programId}
      ), completed_by_user AS (
        SELECT lp."userId", COUNT(*)::int AS completed
        FROM "LessonProgress" lp
        JOIN "Lesson" l ON l.id = lp."lessonId"
        WHERE l."programId" = ${lesson.programId} AND lp.status = 'COMPLETED'
        GROUP BY lp."userId"
      ), enrollment_progress AS (
        SELECT e.id, lt.total, COALESCE(cb.completed, 0) AS completed
        FROM "Enrollment" e
        CROSS JOIN lesson_totals lt
        LEFT JOIN completed_by_user cb ON cb."userId" = e."userId"
        WHERE e."programId" = ${lesson.programId}
      )
      UPDATE "Enrollment" e
      SET progress = CASE WHEN ep.total = 0 THEN 0 ELSE ROUND(ep.completed * 100.0 / ep.total)::int END,
          status = CASE WHEN ep.total > 0 AND ep.completed >= ep.total THEN 'COMPLETED'::"EnrollmentStatus" ELSE 'ACTIVE'::"EnrollmentStatus" END,
          "completedAt" = CASE WHEN ep.total > 0 AND ep.completed >= ep.total THEN COALESCE(e."completedAt", CURRENT_TIMESTAMP) ELSE NULL END
      FROM enrollment_progress ep
      WHERE e.id = ep.id
    `;
  });
};

module.exports = {
  createLesson,
  getLessonsByProgramId,
  deleteLesson,
};
