const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const mentorController = require('../controllers/mentorController');

router.get('/stats', authMiddleware, roleMiddleware('MENTOR', 'ADMIN'), mentorController.getMentorStats);

module.exports = router;
