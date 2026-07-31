const prisma = require('../prisma/client');

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let stats = {};

    if (role === 'STUDENT') {
      const activeEnrollments = await prisma.enrollment.count({
        where: { userId, status: 'ACTIVE' }
      });
      
      const completedEnrollments = await prisma.enrollment.count({
        where: { userId, status: 'COMPLETED' }
      });

      const upcomingSessions = await prisma.session.findMany({
        where: {
          attendees: { some: { id: userId } },
          startsAt: { gte: new Date() }
        },
        orderBy: { startsAt: 'asc' },
        take: 5,
        include: {
          program: { select: { title: true } }
        }
      });

      stats = {
        activeEnrollments,
        completedEnrollments,
        upcomingSessions
      };
    } else if (role === 'MENTOR') {
      const activePrograms = await prisma.program.count({
        where: { mentorId: userId, status: 'ACTIVE' }
      });

      const totalStudents = await prisma.enrollment.count({
        where: { program: { mentorId: userId }, status: 'ACTIVE' }
      });

      const upcomingSessions = await prisma.session.findMany({
        where: { mentorId: userId, startsAt: { gte: new Date() } },
        orderBy: { startsAt: 'asc' },
        take: 5,
        include: {
          program: { select: { title: true } }
        }
      });

      stats = {
        activePrograms,
        totalStudents,
        upcomingSessions
      };
    } else if (role === 'ADMIN') {
      const totalUsers = await prisma.user.count();
      const totalPrograms = await prisma.program.count();
      const totalEnrollments = await prisma.enrollment.count();

      stats = {
        totalUsers,
        totalPrograms,
        totalEnrollments
      };
    }

    res.status(200).json({ stats });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
};
