const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const handleValidation = require('../middleware/validationMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const {
  createSubmissionValidation,
  reviewSubmissionValidation,
} = require('../validations/submissionValidation');

router.post(
  '/',
  authMiddleware,
  roleMiddleware('STUDENT'),
  createSubmissionValidation,
  handleValidation,
  submissionController.submitAssignment
);

router.get(
  '/me',
  authMiddleware,
  roleMiddleware('STUDENT'),
  submissionController.getMySubmissions
);

router.patch(
  '/:id/review',
  authMiddleware,
  roleMiddleware('MENTOR'),
  reviewSubmissionValidation,
  handleValidation,
  submissionController.reviewSubmission
);

module.exports = router;
