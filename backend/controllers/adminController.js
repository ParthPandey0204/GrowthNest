const prisma = require('../prisma/client');

const PAGE_LIMIT = 100;

const getPagination = (query) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(PAGE_LIMIT, Math.max(1, Number.parseInt(query.limit, 10) || 10));
  return { page, limit, skip: (page - 1) * limit };
};

const isKnownPrismaRecordError = (error) => error.code === 'P2025';

const getUsers = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const roleFilter = ['STUDENT', 'MENTOR', 'ADMIN'].includes(req.query.role)
      ? req.query.role
      : undefined;

    const where = {
      ...(roleFilter && { role: roleFilter }),
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          isApproved: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.status(200).json({
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['STUDENT', 'MENTOR', 'ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
    });

    res.status(200).json({ message: 'User role updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Change user role error:', error);
    if (isKnownPrismaRecordError(error)) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Failed to update user role' });
  }
};

const approveMentor = async (req, res) => {
  try {
    const { id } = req.params;

    const mentor = await prisma.user.findFirst({
      where: { id, role: 'MENTOR' },
      select: { id: true },
    });

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isApproved: true },
    });

    res.status(200).json({ message: 'Mentor approved successfully', user: updatedUser });
  } catch (error) {
    console.error('Approve mentor error:', error);
    if (isKnownPrismaRecordError(error)) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    res.status(500).json({ message: 'Failed to approve mentor' });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'isActive must be a boolean' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive },
    });

    res.status(200).json({ message: `User ${isActive ? 'activated' : 'suspended'} successfully`, user: updatedUser });
  } catch (error) {
    console.error('Toggle user status error:', error);
    if (isKnownPrismaRecordError(error)) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Failed to update user status' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalPrograms = await prisma.program.count();

    // Approximate revenue by joining enrollments with program price
    const enrollments = await prisma.enrollment.findMany({
      include: { program: { select: { price: true } } }
    });
    const totalRevenue = enrollments.reduce((sum, enroll) => {
      const price = enroll.program?.price ? parseFloat(enroll.program.price) : 0;
      return sum + price;
    }, 0);

    // Monthly Growth (mock simple aggregation for chart: users & enrollments over last 6 months)
    const monthlyGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toLocaleString('default', { month: 'short' });
      const yearStr = date.getFullYear().toString().substr(-2);

      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const usersThisMonth = await prisma.user.count({
        where: { createdAt: { gte: startOfMonth, lte: endOfMonth } }
      });
      const enrollmentsThisMonth = await prisma.enrollment.count({
        where: { enrolledAt: { gte: startOfMonth, lte: endOfMonth } }
      });

      monthlyGrowth.push({
        name: `${monthStr} '${yearStr}`,
        users: usersThisMonth,
        enrollments: enrollmentsThisMonth
      });
    }

    res.status(200).json({
      totalUsers,
      totalPrograms,
      totalRevenue,
      monthlyGrowth
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
  }
};

const getActivityLog = async (req, res) => {
  try {
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, createdAt: true, role: true }
    });

    const recentEnrollments = await prisma.enrollment.findMany({
      take: 5,
      orderBy: { enrolledAt: 'desc' },
      include: { user: { select: { name: true } }, program: { select: { title: true } } }
    });

    const recentSessions = await prisma.session.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { mentor: { select: { name: true } } }
    });

    const activities = [
      ...recentUsers.map(u => ({ id: `user-${u.id}`, type: 'USER_SIGNUP', message: `New ${u.role.toLowerCase()} signup: ${u.name}`, date: u.createdAt })),
      ...recentEnrollments.map(e => ({ id: `enroll-${e.id}`, type: 'ENROLLMENT', message: `${e.user.name} enrolled in ${e.program.title}`, date: e.enrolledAt })),
      ...recentSessions.map(s => ({ id: `session-${s.id}`, type: 'SESSION', message: `${s.mentor.name} scheduled a session: ${s.title}`, date: s.createdAt }))
    ];

    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json(activities.slice(0, 10));
  } catch (error) {
    console.error('Get activity log error:', error);
    res.status(500).json({ message: 'Failed to fetch activity log', error: error.message });
  }
};

const getPrograms = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const status = ['DRAFT', 'ACTIVE', 'ARCHIVED'].includes(req.query.status)
      ? req.query.status
      : undefined;
    const where = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { mentor: { name: { contains: search, mode: 'insensitive' } } },
          { mentor: { email: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [programs, total] = await Promise.all([
      prisma.program.findMany({
        where,
        skip,
        take: limit,
        include: {
          mentor: { select: { name: true, email: true } },
          _count: { select: { enrollments: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.program.count({ where })
    ]);

    res.status(200).json({
      programs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get programs error:', error);
    res.status(500).json({ message: 'Failed to fetch programs' });
  }
};

const updateProgramStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['DRAFT', 'ACTIVE', 'ARCHIVED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid program status' });
    }

    const updatedProgram = await prisma.program.update({
      where: { id },
      data: { status }
    });

    res.status(200).json({ message: 'Program status updated', program: updatedProgram });
  } catch (error) {
    console.error('Update program status error:', error);
    if (isKnownPrismaRecordError(error)) {
      return res.status(404).json({ message: 'Program not found' });
    }
    res.status(500).json({ message: 'Failed to update program status' });
  }
};

module.exports = {
  getUsers,
  changeUserRole,
  approveMentor,
  toggleUserStatus,
  getDashboardStats,
  getActivityLog,
  getPrograms,
  updateProgramStatus,
};
