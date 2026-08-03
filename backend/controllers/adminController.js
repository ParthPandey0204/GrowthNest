const prisma = require('../prisma/client');

const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count()
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
    res.status(500).json({ message: 'Failed to update user role', error: error.message });
  }
};

const approveMentor = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await prisma.user.update({
      where: { id, role: 'MENTOR' },
      data: { isApproved: true },
    });

    res.status(200).json({ message: 'Mentor approved successfully', user: updatedUser });
  } catch (error) {
    console.error('Approve mentor error:', error);
    res.status(500).json({ message: 'Failed to approve mentor', error: error.message });
  }
};

module.exports = {
  getUsers,
  changeUserRole,
  approveMentor,
};
