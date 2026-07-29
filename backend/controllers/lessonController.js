const lessonService = require('../services/lessonService');

const createLesson = async (req, res) => {
  try {
    const lesson = await lessonService.createLesson(
      req.params.id,
      req.user.id,
      req.body
    );
    return res.status(201).json({ lesson });
  } catch (error) {
    console.error('Create lesson error:', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    if (error.code === 'P2002') {
      return res
        .status(409)
        .json({ message: 'A lesson with this order already exists in the program' });
    }
    return res.status(500).json({ message: 'Unable to create lesson' });
  }
};

const getLessonsByProgramId = async (req, res) => {
  try {
    const lessons = await lessonService.getLessonsByProgramId(req.params.id);
    return res.status(200).json({ lessons });
  } catch (error) {
    console.error('List lessons error:', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unable to fetch lessons' });
  }
};

module.exports = {
  createLesson,
  getLessonsByProgramId,
};
