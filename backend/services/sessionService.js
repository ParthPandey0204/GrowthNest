const prisma = require('../prisma/client');

const notFound = (message) => Object.assign(new Error(message), { statusCode: 404 });
const forbidden = (message) => Object.assign(new Error(message), { statusCode: 403 });

const assertProgramOwnership = async (programId, mentorId) => {
  if (!programId) return;
  const program = await prisma.program.findFirst({ where: { id: programId, mentorId }, select: { id: true } });
  if (!program) throw forbidden('You can only schedule sessions for your own programs');
};

const createSession = async (mentorId, data) => {
  await assertProgramOwnership(data.programId, mentorId);
  const startsAt = new Date(data.scheduledAt);
  return prisma.session.create({
    data: {
      title: data.title,
      startsAt,
      endsAt: new Date(startsAt.getTime() + data.duration * 60000),
      meetingUrl: data.meetLink || null,
      mentorId,
      programId: data.programId || null,
    },
  });
};

const listSessions = async (user, filters) => {
  const where = {
    ...(filters.programId && { programId: filters.programId }),
    ...(filters.status && { status: filters.status }),
  };
  if (user.role === 'MENTOR') where.mentorId = user.id;
  if (user.role === 'STUDENT') {
    where.OR = [
      { attendees: { some: { id: user.id } } },
      { program: { enrollments: { some: { userId: user.id } } } },
    ];
  }
  if (user.role === 'ADMIN' && filters.mentorId) where.mentorId = filters.mentorId;

  return prisma.session.findMany({
    where,
    include: {
      mentor: { select: { id: true, name: true, email: true, avatar: true } },
      program: { select: { id: true, title: true } },
      _count: { select: { attendees: true } },
    },
    orderBy: { startsAt: 'asc' },
  });
};

const updateSession = async (id, user, data) => {
  const existing = await prisma.session.findUnique({ where: { id } });
  if (!existing) throw notFound('Session not found');
  if (user.role !== 'ADMIN' && existing.mentorId !== user.id) throw forbidden('You can only update your own sessions');

  const startsAt = data.scheduledAt ? new Date(data.scheduledAt) : existing.startsAt;
  const currentDuration = existing.endsAt ? (existing.endsAt.getTime() - existing.startsAt.getTime()) / 60000 : null;
  const duration = data.duration ?? currentDuration;
  return prisma.session.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.meetLink !== undefined && { meetingUrl: data.meetLink || null }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.scheduledAt !== undefined && { startsAt }),
      ...(duration !== null && duration !== undefined && (data.scheduledAt !== undefined || data.duration !== undefined) && { endsAt: new Date(startsAt.getTime() + duration * 60000) }),
    },
  });
};

const deleteSession = async (id, user) => {
  const existing = await prisma.session.findUnique({ where: { id } });
  if (!existing) throw notFound('Session not found');
  if (user.role !== 'ADMIN' && existing.mentorId !== user.id) throw forbidden('You can only delete your own sessions');
  return prisma.session.delete({ where: { id } });
};

const attendSession = async (id, userId) => {
  const existing = await prisma.session.findUnique({ where: { id } });
  if (!existing) throw notFound('Session not found');
  if (!['SCHEDULED', 'LIVE'].includes(existing.status)) throw Object.assign(new Error('Cannot mark attendance for this session right now'), { statusCode: 400 });
  return prisma.session.update({ where: { id }, data: { attendees: { connect: { id: userId } } }, include: { attendees: { select: { id: true, name: true } } } });
};

module.exports = { createSession, listSessions, updateSession, deleteSession, attendSession };
