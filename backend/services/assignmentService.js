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

const listAssignments = async (programId) => {
  const where = {};

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
    orderBy: { createdAt: 'desc' },
  });
};

module.exports = {
  createAssignment,
  listAssignments,
};
