const prisma = require('../prisma/client');

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
  const enrolled = user && await prisma.enrollment.findFirst({ where: { programId, userId: user.id, status: 'ACTIVE' }, select: { id: true } });
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

  const enrollments = await prisma.enrollment.findMany({ where: { programId: lesson.programId }, select: { id: true, userId: true } });
  await prisma.lesson.delete({ where: { id: lessonId } });
  const remaining = await prisma.lesson.findMany({ where: { programId: lesson.programId }, select: { id: true } });
  const remainingIds = remaining.map(({ id }) => id);
  for (const enrollment of enrollments) {
    const completed = remainingIds.length ? await prisma.lessonProgress.count({ where: { userId: enrollment.userId, lessonId: { in: remainingIds }, status: 'COMPLETED' } }) : 0;
    const progress = remainingIds.length ? Math.round((completed / remainingIds.length) * 100) : 0;
    await prisma.enrollment.update({ where: { id: enrollment.id }, data: { progress, status: progress === 100 && remainingIds.length ? 'COMPLETED' : 'ACTIVE', completedAt: progress === 100 && remainingIds.length ? new Date() : null } });
  }
};

module.exports = {
  createLesson,
  getLessonsByProgramId,
  deleteLesson,
};
