const prisma = require('../prisma/client');

const scheduleSession = async (req, res) => {
  try {
    const { title, scheduledAt, duration, meetLink, programId } = req.body;
    const mentorId = req.user.id;

    if (!title || !scheduledAt || !duration) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const startsAt = new Date(scheduledAt);
    const endsAt = new Date(startsAt.getTime() + duration * 60000);

    const sessionData = {
      title,
      startsAt,
      endsAt,
      meetingUrl: meetLink,
      mentorId,
    };

    if (programId) {
      sessionData.programId = programId;
    }

    const session = await prisma.session.create({
      data: sessionData,
    });

    res.status(201).json({ message: 'Session scheduled successfully', session });
  } catch (error) {
    console.error('Schedule session error:', error);
    res.status(500).json({ message: 'Failed to schedule session', error: error.message });
  }
};

const getSessions = async (req, res) => {
  try {
    const { programId, mentorId } = req.query;

    const filter = {};
    if (programId) filter.programId = programId;
    if (mentorId) filter.mentorId = mentorId;

    const sessions = await prisma.session.findMany({
      where: filter,
      include: {
        mentor: { select: { id: true, name: true, email: true, avatar: true } },
        program: { select: { id: true, title: true } },
      },
      orderBy: { startsAt: 'asc' },
    });

    res.status(200).json(sessions);
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Failed to fetch sessions', error: error.message });
  }
};

module.exports = {
  scheduleSession,
  getSessions,
};
