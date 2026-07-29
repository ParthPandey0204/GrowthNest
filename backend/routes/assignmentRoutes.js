const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const submissionController = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const handleValidation = require('../middleware/validationMiddleware');
const {
  createAssignmentValidation,
  listAssignmentsQueryValidation,
} = require('../validations/assignmentValidation');

router.post(
  '/',
  authMiddleware,
  roleMiddleware('MENTOR'),
  createAssignmentValidation,
  handleValidation,
  assignmentController.createAssignment
);

router.get(
  '/',
  authMiddleware,
  roleMiddleware('STUDENT', 'MENTOR', 'ADMIN'),
  listAssignmentsQueryValidation,
  handleValidation,
  assignmentController.listAssignments
);

router.get(
  '/:id/submissions',
  authMiddleware,
  roleMiddleware('MENTOR'),
  submissionController.getAssignmentSubmissions
);

module.exports = router;
