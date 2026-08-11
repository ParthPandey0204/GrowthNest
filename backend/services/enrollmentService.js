const prisma = require('../prisma/client');
const { mentorPublicSelect } = require('./programService');

const createEnrollment = async (userId, programId) => {
  const program = await prisma.program.findUnique({
    where: { id: programId },
  });

  if (!program) {
    const error = new Error('Program not found');
    error.statusCode = 404;
    throw error;
  }

  if (program.status !== 'ACTIVE') {
    const error = new Error('Cannot enroll in a program that is not active');
    error.statusCode = 400;
    throw error;
  }

  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      userId_programId: {
        userId,
        programId,
      },
    },
  });

  if (existingEnrollment) {
    const error = new Error('You are already enrolled in this program');
    error.statusCode = 409;
    throw error;
  }

  return await prisma.enrollment.create({
    data: {
      userId,
      programId,
      status: 'ACTIVE',
    },
    include: {
      program: {
        include: {
          mentor: { select: mentorPublicSelect },
        },
      },
    },
  });
};

const getStudentEnrollments = async (userId) => {
  return await prisma.enrollment.findMany({
    where: { userId },
    orderBy: { enrolledAt: 'desc' },
    include: {
      program: {
        include: {
          mentor: { select: mentorPublicSelect },
        },
      },
    },
  });
};

const getProgramEnrollmentsForMentor = async (programId, userId) => {
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

  return await prisma.enrollment.findMany({
    where: { programId },
    orderBy: { enrolledAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          bio: true,
          createdAt: true,
        },
      },
    },
  });
};

const updateEnrollmentProgress = async (id, userId, progress) => {
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: { id },
  });

  if (!existingEnrollment) {
    const error = new Error('Enrollment not found');
    error.statusCode = 404;
    throw error;
  }

  if (existingEnrollment.userId !== userId) {
    const error = new Error('Forbidden: You do not own this enrollment');
    error.statusCode = 403;
    throw error;
  }

  const updateData = { progress };

  if (progress === 100) {
    updateData.status = 'COMPLETED';
    updateData.completedAt = new Date();
  } else if (existingEnrollment.status === 'COMPLETED' && progress < 100) {
    updateData.status = 'ACTIVE';
    updateData.completedAt = null;
  }

  return await prisma.enrollment.update({
    where: { id },
    data: updateData,
    include: {
      program: {
        include: {
          mentor: { select: mentorPublicSelect },
        },
      },
    },
  });
};

const updateLessonProgress = async (userId, lessonId, status, progress) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { program: { include: { lessons: true } } }
  });

  if (!lesson) {
    const error = new Error('Lesson not found');
    error.statusCode = 404;
    throw error;
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_programId: { userId, programId: lesson.programId } }
  });

  if (!enrollment) {
    const error = new Error('Forbidden: You are not enrolled in this program');
    error.statusCode = 403;
    throw error;
  }

  const updateData = {
    status,
    progress
  };

  if (status === 'COMPLETED') {
    updateData.completedAt = new Date();
    updateData.progress = 100;
  }

  const lessonProgress = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: updateData,
    create: {
      userId,
      lessonId,
      ...updateData
    }
  });

  // Calculate new overall enrollment progress
  const totalLessons = lesson.program.lessons.length;
  const allCompletedLessons = await prisma.lessonProgress.count({
    where: {
      userId,
      lessonId: { in: lesson.program.lessons.map(l => l.id) },
      status: 'COMPLETED'
    }
  });

  const overallProgress = totalLessons > 0 ? Math.round((allCompletedLessons / totalLessons) * 100) : 0;
  
  await updateEnrollmentProgress(enrollment.id, userId, overallProgress);

  return lessonProgress;
};

const getLessonProgressForProgram = async (userId, programId) => {
  const enrollment = await prisma.enrollment.findUnique({ where: { userId_programId: { userId, programId } } });
  if (!enrollment) {
    const error = new Error('Forbidden: You are not enrolled in this program');
    error.statusCode = 403;
    throw error;
  }
  return prisma.lessonProgress.findMany({
    where: { userId, lesson: { programId } },
    select: { lessonId: true, status: true, progress: true, completedAt: true },
  });
};

module.exports = {
  createEnrollment,
  getStudentEnrollments,
  getProgramEnrollmentsForMentor,
  updateEnrollmentProgress,
  updateLessonProgress,
  getLessonProgressForProgram,
};
