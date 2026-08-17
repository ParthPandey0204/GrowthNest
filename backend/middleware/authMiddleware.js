const jwt = require('jsonwebtoken');

const prisma = require('../prisma/client');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.get('authorization');
    const [scheme, token] = authHeader ? authHeader.split(' ') : [];

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Authentication token is required' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid authentication token' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'This account has been suspended' });
    }

    if (user.role === 'MENTOR' && !user.isApproved) {
      return res.status(403).json({ message: 'Your mentor account is pending administrator approval' });
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid authentication token' });
    }

    console.error('Authentication error:', error);

    if (error.message === 'JWT_SECRET is not configured') {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Unable to authenticate request' });
  }
};

module.exports = authMiddleware;
