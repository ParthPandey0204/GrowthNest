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

const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, scheduledAt, duration, meetLink, status } = req.body;
    
    const existingSession = await prisma.session.findUnique({ where: { id } });
    if (!existingSession) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (existingSession.mentorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You can only update your own sessions' });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (meetLink !== undefined) updateData.meetingUrl = meetLink;
    if (status) updateData.status = status;

    if (scheduledAt || duration) {
      const startsAt = scheduledAt ? new Date(scheduledAt) : existingSession.startsAt;
      let newDuration = duration;
      
      if (!duration && existingSession.endsAt) {
        newDuration = (existingSession.endsAt.getTime() - existingSession.startsAt.getTime()) / 60000;
      }
      
      updateData.startsAt = startsAt;
      if (newDuration) {
        updateData.endsAt = new Date(startsAt.getTime() + newDuration * 60000);
      }
    }

    const updatedSession = await prisma.session.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({ message: 'Session updated successfully', session: updatedSession });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ message: 'Failed to update session', error: error.message });
  }
};

const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingSession = await prisma.session.findUnique({ where: { id } });
    if (!existingSession) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (existingSession.mentorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You can only delete your own sessions' });
    }

    await prisma.session.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ message: 'Failed to delete session', error: error.message });
  }
};

module.exports = {
  scheduleSession,
  getSessions,
  updateSession,
  deleteSession,
};
