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
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['STUDENT', 'MENTOR', 'ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    if (id === req.user.id) return res.status(400).json({ message: 'You cannot change your own role' });
    const current = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } });
    if (!current) return res.status(404).json({ message: 'User not found' });
    if (role === 'MENTOR' && current.role !== 'MENTOR') return res.status(400).json({ message: 'Use mentor approval to grant mentor access' });

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role, tokenVersion: { increment: 1 } }, select: { id: true, name: true, email: true, role: true, isActive: true, isApproved: true },
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
    if (id === req.user.id) return res.status(400).json({ message: 'You cannot modify your own account' });

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isApproved: true }, select: { id: true, name: true, email: true, role: true, isActive: true, isApproved: true },
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
    if (id === req.user.id) return res.status(400).json({ message: 'You cannot modify your own account' });

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive, tokenVersion: { increment: 1 } }, select: { id: true, name: true, email: true, role: true, isActive: true, isApproved: true },
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

    const revenueRows = await prisma.$queryRaw`SELECT COALESCE(SUM(p.price), 0)::float AS total FROM "Enrollment" e JOIN "Program" p ON p.id = e."programId"`;
    const potentialRevenue = revenueRows[0]?.total || 0;

    // Monthly Growth (mock simple aggregation for chart: users & enrollments over last 6 months)
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toLocaleString('default', { month: 'short' });
      const yearStr = date.getFullYear().toString().substr(-2);
      months.push({
        name: `${monthStr} '${yearStr}`,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
      });
    }
    const firstMonth = new Date(months[0].year, months[0].month - 1, 1);
    const nextMonth = new Date(months[months.length - 1].year, months[months.length - 1].month, 1);
    const [userGroups, enrollmentGroups] = await Promise.all([
      prisma.$queryRaw`SELECT EXTRACT(YEAR FROM "createdAt")::int AS year, EXTRACT(MONTH FROM "createdAt")::int AS month, COUNT(*)::int AS count FROM "User" WHERE "createdAt" >= ${firstMonth} AND "createdAt" < ${nextMonth} GROUP BY 1, 2`,
      prisma.$queryRaw`SELECT EXTRACT(YEAR FROM "enrolledAt")::int AS year, EXTRACT(MONTH FROM "enrolledAt")::int AS month, COUNT(*)::int AS count FROM "Enrollment" WHERE "enrolledAt" >= ${firstMonth} AND "enrolledAt" < ${nextMonth} GROUP BY 1, 2`,
    ]);
    const monthCounts = (rows) => new Map(rows.map((row) => [`${row.year}-${row.month}`, row.count]));
    const usersByMonth = monthCounts(userGroups);
    const enrollmentsByMonth = monthCounts(enrollmentGroups);
    const monthlyGrowth = months.map(({ name, year, month }) => ({ name, users: usersByMonth.get(`${year}-${month}`) || 0, enrollments: enrollmentsByMonth.get(`${year}-${month}`) || 0 }));

    res.status(200).json({
      totalUsers,
      totalPrograms,
      potentialRevenue,
      monthlyGrowth
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
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
    res.status(500).json({ message: 'Failed to fetch activity log' });
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
      data: { status, isApproved: status === 'ACTIVE', submittedForReview: false }
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
