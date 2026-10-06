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

const getLessonsByProgramId = async (programId) => {
  const existingProgram = await prisma.program.findUnique({
    where: { id: programId },
  });

  if (!existingProgram) {
    const error = new Error('Program not found');
    error.statusCode = 404;
    throw error;
  }

  return await prisma.lesson.findMany({
    where: { programId },
    orderBy: { order: 'asc' },
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

  await prisma.lesson.delete({ where: { id: lessonId } });
};

module.exports = {
  createLesson,
  getLessonsByProgramId,
  deleteLesson,
};
