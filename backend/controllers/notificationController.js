const prisma = require('../prisma/client');

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' }, take: 20 });
    return res.status(200).json({ notifications });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch notifications' });
  }
};

module.exports = { getMyNotifications };
