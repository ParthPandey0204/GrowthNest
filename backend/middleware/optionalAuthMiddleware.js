const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');

module.exports = async (req, res, next) => {
  try {
    const [scheme, token] = (req.get('authorization') || '').split(' ');
    if (scheme === 'Bearer' && token && process.env.JWT_SECRET) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, role: true, isActive: true, isApproved: true, tokenVersion: true } });
      if (user?.isActive && user.tokenVersion === (payload.tokenVersion || 0) && (user.role !== 'MENTOR' || user.isApproved)) req.user = user;
    }
  } catch { /* Public program details remain available to anonymous visitors. */ }
  return next();
};
