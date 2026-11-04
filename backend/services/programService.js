const prisma = require('../prisma/client');

const mentorPublicSelect = {
  id: true,
  name: true,
  avatar: true,
  bio: true,
};

const createProgram = async ({ title, description, price, thumbnail, mentorId }) => {
  return await prisma.program.create({
    data: {
      title,
      description: description || null,
      price: price != null ? price : null,
      thumbnail: thumbnail || null,
      mentorId,
    },
  });
};

const listPrograms = async ({ page = 1, limit = 10, search = '' }) => {
  const skip = (page - 1) * limit;
  const where = {
    status: 'ACTIVE',
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { mentor: { name: { contains: search, mode: 'insensitive' } } },
      ],
    }),
  };

  const [programs, total] = await Promise.all([
    prisma.program.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        mentor: { select: mentorPublicSelect },
      },
    }),
    prisma.program.count({ where }),
  ]);

  return {
    programs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

const listMentorPrograms = async ({ mentorId, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const where = { mentorId, status: { not: 'ARCHIVED' } };
  const [programs, total] = await Promise.all([
    prisma.program.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        mentor: { select: mentorPublicSelect },
        _count: { select: { enrollments: true, lessons: true } },
      },
    }),
    prisma.program.count({ where }),
  ]);

  return {
    programs,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
};

const getProgramById = async (id, user) => {
  const program = await prisma.program.findFirst({
    where: {
      id,
      status: 'ACTIVE',
    },
    include: {
      mentor: { select: mentorPublicSelect },
      lessons: { orderBy: { order: 'asc' }, select: { id: true, title: true, topic: true, type: true, order: true } },
      assignments: { where: { status: 'PUBLISHED' }, orderBy: { createdAt: 'asc' }, select: { id: true, title: true, description: true, dueAt: true, topic: true } },
    },
  });
  if (!program || !user) return program;
  const enrolled = await prisma.enrollment.findFirst({ where: { programId: id, userId: user.id, status: 'ACTIVE' }, select: { id: true } });
  if (user.role === 'ADMIN' || program.mentorId === user.id || enrolled) {
    program.lessons = await prisma.lesson.findMany({ where: { programId: id }, orderBy: { order: 'asc' } });
  }
  return program;
};

const getMentorProgramById = async (id, mentorId) => {
  return prisma.program.findFirst({
    where: { id, mentorId, status: { not: 'ARCHIVED' } },
    include: {
      mentor: { select: mentorPublicSelect },
      lessons: { orderBy: { order: 'asc' } },
      assignments: { where: { status: 'PUBLISHED' }, orderBy: { createdAt: 'asc' }, select: { id: true, title: true, description: true, dueAt: true, topic: true } },
      _count: { select: { enrollments: true, lessons: true } },
    },
  });
};

const updateProgram = async (id, userId, { title, description, price, thumbnail, status }) => {
  const existingProgram = await prisma.program.findUnique({
    where: { id },
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

  if (status === 'ACTIVE' && existingProgram.status !== 'ACTIVE') {
    const error = new Error('Programs must be approved by an admin before publication');
    error.statusCode = 403;
    throw error;
  }

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (price !== undefined) updateData.price = price != null ? price : null;
  if (thumbnail !== undefined) updateData.thumbnail = thumbnail || null;
  if (status !== undefined) updateData.status = status;

  return await prisma.program.update({
    where: { id },
    data: updateData,
  });
};

const archiveProgram = async (id, userId) => {
  const existingProgram = await prisma.program.findUnique({
    where: { id },
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

  return await prisma.program.update({
    where: { id },
    data: { status: 'ARCHIVED' },
  });
};

module.exports = {
  mentorPublicSelect,
  createProgram,
  listPrograms,
  listMentorPrograms,
  getProgramById,
  getMentorProgramById,
  updateProgram,
  archiveProgram,
};
