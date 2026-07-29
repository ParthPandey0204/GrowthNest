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

const listPrograms = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const where = { status: 'ACTIVE' };

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

const getProgramById = async (id) => {
  return await prisma.program.findFirst({
    where: {
      id,
      status: 'ACTIVE',
    },
    include: {
      mentor: { select: mentorPublicSelect },
      lessons: { orderBy: { order: 'asc' } },
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
  getProgramById,
  updateProgram,
  archiveProgram,
};
