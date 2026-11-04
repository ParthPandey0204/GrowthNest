const prisma = require('../prisma/client');

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' }, take: 20 });
    return res.status(200).json({ notifications });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch notifications' });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const result = await prisma.notification.updateMany({ where: { id: req.params.id, userId: req.user.id, readAt: null }, data: { readAt: new Date() } });
    if (!result.count) return res.status(404).json({ message: 'Notification not found' });
    return res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update notification' });
  }
};

module.exports = { getMyNotifications, markNotificationRead };
