const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const handleValidation = require('../middleware/validationMiddleware');
const {
  createEnrollmentValidation,
  updateProgressValidation,
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

router.patch(
  '/:id/progress',
  authMiddleware,
  roleMiddleware('STUDENT'),
  updateProgressValidation,
  handleValidation,
  enrollmentController.updateProgress
);

module.exports = router;
