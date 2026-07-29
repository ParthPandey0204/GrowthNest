const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const programRoutes = require('./programRoutes');
const enrollmentRoutes = require('./enrollmentRoutes');
const assignmentRoutes = require('./assignmentRoutes');
const submissionRoutes = require('./submissionRoutes');
const sessionRoutes = require('./sessionRoutes');

router.use('/auth', authRoutes);
router.use('/programs', programRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/submissions', submissionRoutes);
router.use('/sessions', sessionRoutes);

module.exports = router;
