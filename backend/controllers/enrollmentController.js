const enrollmentService = require('../services/enrollmentService');

const createEnrollment = async (req, res) => {
  try {
    const { programId } = req.body;
    const enrollment = await enrollmentService.createEnrollment(req.user.id, programId);
    return res.status(201).json({ enrollment });
  } catch (error) {
    console.error('Create enrollment error:', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'You are already enrolled in this program' });
    }
    return res.status(500).json({ message: 'Unable to enroll in program' });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await enrollmentService.getStudentEnrollments(req.user.id);
    return res.status(200).json({ enrollments });
  } catch (error) {
    console.error('List my enrollments error:', error);
    return res.status(500).json({ message: 'Unable to fetch enrollments' });
  }
};

const getProgramEnrollments = async (req, res) => {
  try {
    const enrollments = await enrollmentService.getProgramEnrollmentsForMentor(
      req.params.id,
      req.user.id
    );
    return res.status(200).json({ enrollments });
  } catch (error) {
    console.error('List program enrollments error:', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unable to fetch enrollments' });
  }
};

const updateProgress = async (req, res) => {
  try {
    const enrollment = await enrollmentService.updateEnrollmentProgress(
      req.params.id,
      req.user.id,
      req.body.progress
    );
    return res.status(200).json({ enrollment });
  } catch (error) {
    console.error('Update enrollment progress error:', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unable to update progress' });
  }
};

const updateLessonProgress = async (req, res) => {
  try {
    const lessonProgress = await enrollmentService.updateLessonProgress(
      req.user.id,
      req.body.lessonId,
      req.body.status,
      req.body.progress
    );
    return res.status(200).json({ lessonProgress });
  } catch (error) {
    console.error('Update lesson progress error:', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unable to update lesson progress' });
  }
};

const getLessonProgress = async (req, res) => {
  try {
    const lessonProgress = await enrollmentService.getLessonProgressForProgram(req.user.id, req.params.programId);
    return res.status(200).json({ lessonProgress });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    return res.status(500).json({ message: 'Unable to fetch lesson progress' });
  }
};

const getProgressSummary = async (req, res) => {
  try {
    return res.status(200).json(await enrollmentService.getStudentProgressSummary(req.user.id));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch progress summary' });
  }
};

module.exports = {
  createEnrollment,
  getMyEnrollments,
  getProgramEnrollments,
  updateProgress,
  updateLessonProgress,
  getLessonProgress,
  getProgressSummary,
};
