const prisma = require('../prisma/client');

const createAssignment = async (userId, { title, description, dueDate, programId }) => {
  const program = await prisma.program.findUnique({
    where: { id: programId },
  });

  if (!program) {
    const error = new Error('Program not found');
    error.statusCode = 404;
    throw error;
  }

  if (program.mentorId !== userId) {
    const error = new Error('Forbidden: You do not own this program');
    error.statusCode = 403;
    throw error;
  }

  return await prisma.assignment.create({
    data: {
      title,
      description: description || null,
      prompt: description || null,
      dueAt: dueDate ? new Date(dueDate) : null,
      programId,
      status: 'PUBLISHED',
    },
  });
};

const listAssignments = async (programId, user) => {
  const where = user.role === 'MENTOR' ? { program: { mentorId: user.id } } : {};

  if (programId) {
    const program = await prisma.program.findUnique({
      where: { id: programId },
    });

    if (!program) {
      const error = new Error('Program not found');
      error.statusCode = 404;
      throw error;
    }

    where.programId = programId;
  }

  return await prisma.assignment.findMany({
    where,
    include: { program: { select: { id: true, title: true } }, _count: { select: { submissions: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

const getStudentAssignments = async (userId) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    select: { programId: true }
  });

  const programIds = enrollments.map(e => e.programId);

  return await prisma.assignment.findMany({
    where: { programId: { in: programIds }, status: 'PUBLISHED' },
    include: {
      program: { select: { title: true } },
      submissions: {
        where: { userId },
        select: { id: true, status: true, grade: true, feedback: true, submittedAt: true, reviewedAt: true }
      }
    },
    orderBy: { dueAt: 'asc' },
  });
};

module.exports = {
  createAssignment,
  listAssignments,
  getStudentAssignments,
};
