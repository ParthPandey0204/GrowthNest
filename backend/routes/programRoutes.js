const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');
const lessonController = require('../controllers/lessonController');
const enrollmentController = require('../controllers/enrollmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const handleValidation = require('../middleware/validationMiddleware');
const {
  createProgramValidation,
  updateProgramValidation,
  listProgramsValidation,
} = require('../validations/programValidation');
const { createLessonValidation } = require('../validations/lessonValidation');

// Program CRUD
router.post(
  '/',
  authMiddleware,
  roleMiddleware('MENTOR'),
  createProgramValidation,
  handleValidation,
  programController.createProgram
);

router.get('/', listProgramsValidation, handleValidation, programController.listPrograms);

router.get('/:id', programController.getProgramById);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('MENTOR'),
  updateProgramValidation,
  handleValidation,
  programController.updateProgram
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('MENTOR'),
  programController.archiveProgram
);

// Program Lessons
router.post(
  '/:id/lessons',
  authMiddleware,
  roleMiddleware('MENTOR'),
  createLessonValidation,
  handleValidation,
  lessonController.createLesson
);

router.get(
  '/:id/lessons',
  authMiddleware,
  roleMiddleware('STUDENT', 'MENTOR', 'ADMIN'),
  lessonController.getLessonsByProgramId
);

// Program Enrollments (Mentor view)
router.get(
  '/:id/enrollments',
  authMiddleware,
  roleMiddleware('MENTOR'),
  enrollmentController.getProgramEnrollments
);

module.exports = router;
