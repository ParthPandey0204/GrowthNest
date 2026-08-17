const prisma = require('../prisma/client');

const getMentorStats = async (req, res) => {
  try {
    const mentorId = req.user.id;

    const programs = await prisma.program.findMany({
      where: { mentorId },
      include: {
        enrollments: true,
      }
    });

    const sessionCount = await prisma.session.count({
      where: { mentorId }
    });

    let totalLearners = 0;
    let revenue = 0;
    let totalProgress = 0;
    let totalEnrollmentsWithProgress = 0;

    programs.forEach(program => {
      const price = program.price ? parseFloat(program.price.toString()) : 0;
      totalLearners += program.enrollments.length;
      
      program.enrollments.forEach(enrollment => {
        revenue += price;
        totalProgress += enrollment.progress || 0;
        totalEnrollmentsWithProgress++;
      });
    });

    const avgCompletion = totalEnrollmentsWithProgress > 0 
      ? Math.round(totalProgress / totalEnrollmentsWithProgress) 
      : 0;

    res.status(200).json({
      stats: {
        totalLearners,
        revenue,
        sessionCount,
        avgCompletion,
      }
    });
  } catch (error) {
    console.error('Get mentor stats error:', error);
    res.status(500).json({ message: 'Failed to fetch mentor stats', error: error.message });
  }
};

const getMentorContent = async (req, res) => {
  try {
    const programs = await prisma.program.findMany({
      where: { mentorId: req.user.id },
      select: { id: true, title: true, status: true, updatedAt: true, lessons: { select: { id: true, title: true, type: true, content: true, updatedAt: true }, orderBy: { order: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
    });
    return res.status(200).json({ programs });
  } catch (error) {
    console.error('Get mentor content error:', error);
    return res.status(500).json({ message: 'Unable to fetch mentor content' });
  }
};

const getMentorStudents = async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { program: { mentorId: req.user.id } },
      select: { progress: true, status: true, enrolledAt: true, user: { select: { id: true, name: true, email: true, avatar: true } }, program: { select: { id: true, title: true } } },
      orderBy: { enrolledAt: 'desc' },
    });
    return res.status(200).json({ enrollments });
  } catch (error) {
    console.error('Get mentor students error:', error);
    return res.status(500).json({ message: 'Unable to fetch students' });
  }
};

module.exports = {
  getMentorStats,
  getMentorContent,
  getMentorStudents,
};
