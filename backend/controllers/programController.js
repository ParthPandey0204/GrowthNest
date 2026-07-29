const programService = require('../services/programService');

const createProgram = async (req, res) => {
  try {
    const program = await programService.createProgram({
      ...req.body,
      mentorId: req.user.id,
    });
    return res.status(201).json({ program });
  } catch (error) {
    console.error('Create program error:', error);
    return res.status(500).json({ message: 'Unable to create program' });
  }
};

const listPrograms = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const result = await programService.listPrograms({ page, limit });
    return res.status(200).json(result);
  } catch (error) {
    console.error('List programs error:', error);
    return res.status(500).json({ message: 'Unable to fetch programs' });
  }
};

const getProgramById = async (req, res) => {
  try {
    const program = await programService.getProgramById(req.params.id);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    return res.status(200).json({ program });
  } catch (error) {
    console.error('Get program error:', error);
    return res.status(500).json({ message: 'Unable to fetch program' });
  }
};

const updateProgram = async (req, res) => {
  try {
    const program = await programService.updateProgram(
      req.params.id,
      req.user.id,
      req.body
    );
    return res.status(200).json({ program });
  } catch (error) {
    console.error('Update program error:', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unable to update program' });
  }
};

const archiveProgram = async (req, res) => {
  try {
    const program = await programService.archiveProgram(req.params.id, req.user.id);
    return res.status(200).json({ message: 'Program archived successfully', program });
  } catch (error) {
    console.error('Delete program error:', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unable to archive program' });
  }
};

module.exports = {
  createProgram,
  listPrograms,
  getProgramById,
  updateProgram,
  archiveProgram,
};
