const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getMyNotifications, markNotificationRead } = require('../controllers/notificationController');

const router = express.Router();
router.get('/', authMiddleware, getMyNotifications);
router.patch('/:id/read', authMiddleware, markNotificationRead);
module.exports = router;
