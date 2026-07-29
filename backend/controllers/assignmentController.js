const assignmentService = require('../services/assignmentService');

const createAssignment = async (req, res) => {
  try {
    const assignment = await assignmentService.createAssignment(req.user.id, req.body);
    return res.status(201).json({ assignment });
  } catch (error) {
    console.error('Create assignment error:', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unable to create assignment' });
  }
};

const listAssignments = async (req, res) => {
  try {
    const assignments = await assignmentService.listAssignments(req.query.programId);
    return res.status(200).json({ assignments });
  } catch (error) {
    console.error('List assignments error:', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unable to fetch assignments' });
  }
};

module.exports = {
  createAssignment,
  listAssignments,
};
