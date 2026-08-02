const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const programRoutes = require('./programRoutes');
const enrollmentRoutes = require('./enrollmentRoutes');
const assignmentRoutes = require('./assignmentRoutes');
const submissionRoutes = require('./submissionRoutes');
const sessionRoutes = require('./sessionRoutes');
const userRoutes = require('./userRoutes');
const mentorRoutes = require('./mentorRoutes');
const adminRoutes = require('./adminRoutes');

router.use('/auth', authRoutes);
router.use('/programs', programRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/submissions', submissionRoutes);
router.use('/sessions', sessionRoutes);
router.use('/users', userRoutes);
router.use('/mentor', mentorRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
