const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const handleValidation = require('../middleware/validationMiddleware');
const {
  createEnrollmentValidation,
  updateProgressValidation,
  updateLessonProgressValidation,
} = require('../validations/enrollmentValidation');

router.post(
  '/',
  authMiddleware,
  roleMiddleware('STUDENT'),
  createEnrollmentValidation,
  handleValidation,
  enrollmentController.createEnrollment
);

router.get(
  '/me',
  authMiddleware,
  roleMiddleware('STUDENT'),
  enrollmentController.getMyEnrollments
);

router.get('/me/progress-summary', authMiddleware, roleMiddleware('STUDENT'), enrollmentController.getProgressSummary);

router.patch(
  '/:id/progress',
  authMiddleware,
  roleMiddleware('STUDENT'),
  updateProgressValidation,
  handleValidation,
  enrollmentController.updateProgress
);

router.patch(
  '/lesson-progress',
  authMiddleware,
  roleMiddleware('STUDENT'),
  updateLessonProgressValidation,
  handleValidation,
  enrollmentController.updateLessonProgress
);

router.get('/lesson-progress/:programId', authMiddleware, roleMiddleware('STUDENT'), enrollmentController.getLessonProgress);

module.exports = router;
