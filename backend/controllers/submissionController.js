const submissionService = require('../services/submissionService');

const submitAssignment = async (req, res) => {
  try {
    const submission = await submissionService.submitAssignment(req.user.id, {
      ...req.body,
      file: req.file,
    });
    return res.status(201).json({ submission });
  } catch (error) {
    console.error('Submit assignment error:', error);
    if (error.code === 'LIMIT_FILE_SIZE' || error.message === 'Only PDF and ZIP files are allowed') {
      return res.status(400).json({ message: error.message === 'Only PDF and ZIP files are allowed' ? error.message : 'File size must not exceed 10 MB' });
    }
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unable to submit assignment' });
  }
};

const getAssignmentSubmissions = async (req, res) => {
  try {
    const submissions = await submissionService.getAssignmentSubmissionsForMentor(
      req.params.id,
      req.user.id
    );
    return res.status(200).json({ submissions });
  } catch (error) {
    console.error('List submissions error:', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unable to fetch submissions' });
  }
};

const getMySubmissions = async (req, res) => {
  try {
    const submissions = await submissionService.getStudentSubmissions(req.user.id);
    return res.status(200).json({ submissions });
  } catch (error) {
    console.error('List my submissions error:', error);
    return res.status(500).json({ message: 'Unable to fetch submissions' });
  }
};

const reviewSubmission = async (req, res) => {
  try {
    const submission = await submissionService.reviewSubmission(
      req.params.id,
      req.user.id,
      req.body
    );
    return res.status(200).json({ submission });
  } catch (error) {
    console.error('Review submission error:', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unable to review submission' });
  }
};

module.exports = {
  submitAssignment,
  getAssignmentSubmissions,
  getMySubmissions,
  reviewSubmission,
};
