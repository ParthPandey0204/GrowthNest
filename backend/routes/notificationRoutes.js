const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getMyNotifications } = require('../controllers/notificationController');

const router = express.Router();
router.get('/', authMiddleware, getMyNotifications);
module.exports = router;
