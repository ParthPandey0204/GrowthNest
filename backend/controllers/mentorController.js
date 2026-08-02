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

module.exports = {
  getMentorStats,
};
