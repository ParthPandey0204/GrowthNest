const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');

router.get('/users', authMiddleware, roleMiddleware('ADMIN'), adminController.getUsers);
router.patch('/users/:id/role', authMiddleware, roleMiddleware('ADMIN'), adminController.changeUserRole);
router.patch('/users/:id/status', authMiddleware, roleMiddleware('ADMIN'), adminController.toggleUserStatus);
router.patch('/mentors/:id/approve', authMiddleware, roleMiddleware('ADMIN'), adminController.approveMentor);

// Analytics Routes
router.get('/analytics/dashboard', authMiddleware, roleMiddleware('ADMIN'), adminController.getDashboardStats);
router.get('/analytics/activity', authMiddleware, roleMiddleware('ADMIN'), adminController.getActivityLog);

// Program Moderation Routes
router.get('/programs', authMiddleware, roleMiddleware('ADMIN'), adminController.getPrograms);
router.patch('/programs/:id/status', authMiddleware, roleMiddleware('ADMIN'), adminController.updateProgramStatus);

module.exports = router;
