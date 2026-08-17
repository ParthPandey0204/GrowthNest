const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const mentorController = require('../controllers/mentorController');

router.get('/stats', authMiddleware, roleMiddleware('MENTOR', 'ADMIN'), mentorController.getMentorStats);
router.get('/content', authMiddleware, roleMiddleware('MENTOR'), mentorController.getMentorContent);
router.get('/students', authMiddleware, roleMiddleware('MENTOR'), mentorController.getMentorStudents);

module.exports = router;
