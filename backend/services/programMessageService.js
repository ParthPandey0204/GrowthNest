const prisma = require('../prisma/client');

const fail = (statusCode, message) => Object.assign(new Error(message), { statusCode });
const authorSelect = { id: true, name: true, role: true, avatar: true };

const getAccessibleProgram = async (programId, user) => {
  const program = await prisma.program.findUnique({ where: { id: programId }, select: { id: true, title: true, mentorId: true } });
  if (!program) throw fail(404, 'Program not found');
  if (user.role === 'MENTOR' && program.mentorId === user.id) return program;
  if (user.role === 'STUDENT') {
    const enrollment = await prisma.enrollment.findFirst({ where: { programId, userId: user.id, status: { in: ['ACTIVE', 'COMPLETED'] } }, select: { id: true } });
    if (enrollment) return program;
  }
  throw fail(403, 'You do not have access to this program discussion');
};

const listPrograms = async (user) => {
  if (user.role === 'MENTOR') {
    return prisma.program.findMany({ where: { mentorId: user.id, status: { not: 'ARCHIVED' } }, select: { id: true, title: true, status: true }, orderBy: { updatedAt: 'desc' } });
  }
  return prisma.program.findMany({
    where: { enrollments: { some: { userId: user.id, status: { in: ['ACTIVE', 'COMPLETED'] } } } },
    select: { id: true, title: true, status: true },
    orderBy: { title: 'asc' },
  });
};

const listMessages = async (programId, user, limit = 50) => {
  await getAccessibleProgram(programId, user);
  const messages = await prisma.programMessage.findMany({
    where: { programId, parentId: null },
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: authorSelect },
      replies: { orderBy: { createdAt: 'asc' }, take: 100, include: { author: { select: authorSelect } } },
    },
  });
  return messages.reverse();
};

const createAnnouncement = async (programId, mentorId, { title, body }) => {
  const program = await prisma.program.findUnique({ where: { id: programId }, select: { id: true, title: true, mentorId: true } });
  if (!program) throw fail(404, 'Program not found');
  if (program.mentorId !== mentorId) throw fail(403, 'You can only post announcements to your own programs');

  return prisma.$transaction(async (tx) => {
    const announcement = await tx.programMessage.create({ data: { programId, authorId: mentorId, type: 'ANNOUNCEMENT', title, body }, include: { author: { select: authorSelect }, replies: true } });
    const learners = await tx.enrollment.findMany({ where: { programId, status: 'ACTIVE' }, select: { userId: true } });
    if (learners.length) {
      await tx.notification.createMany({ data: learners.map(({ userId }) => ({
        userId,
        type: 'ANNOUNCEMENT',
        title: `New announcement: ${title}`,
        body: `Your mentor posted an announcement in ${program.title}.`,
      })) });
    }
    return announcement;
  });
};

const createQuestion = async (programId, user, { title, body }) => {
  await getAccessibleProgram(programId, user);
  return prisma.programMessage.create({ data: { programId, authorId: user.id, type: 'QUESTION', title, body }, include: { author: { select: authorSelect }, replies: true } });
};

const createReply = async (programId, messageId, user, body) => {
  await getAccessibleProgram(programId, user);
  const parent = await prisma.programMessage.findFirst({ where: { id: messageId, programId, parentId: null, type: 'QUESTION' }, select: { id: true, isResolved: true } });
  if (!parent) throw fail(404, 'Question not found');
  if (parent.isResolved) throw fail(400, 'This question has been marked as resolved');
  return prisma.programMessage.create({ data: { programId, authorId: user.id, parentId: messageId, type: 'REPLY', body }, include: { author: { select: authorSelect } } });
};

const setQuestionResolved = async (programId, messageId, mentorId, isResolved) => {
  const program = await prisma.program.findUnique({ where: { id: programId }, select: { mentorId: true } });
  if (!program) throw fail(404, 'Program not found');
  if (program.mentorId !== mentorId) throw fail(403, 'Only the program mentor can resolve questions');
  const result = await prisma.programMessage.updateMany({ where: { id: messageId, programId, parentId: null, type: 'QUESTION' }, data: { isResolved } });
  if (!result.count) throw fail(404, 'Question not found');
  return prisma.programMessage.findUnique({ where: { id: messageId }, include: { author: { select: authorSelect }, replies: { orderBy: { createdAt: 'asc' }, include: { author: { select: authorSelect } } } } });
};

module.exports = { listPrograms, listMessages, createAnnouncement, createQuestion, createReply, setQuestionResolved };
