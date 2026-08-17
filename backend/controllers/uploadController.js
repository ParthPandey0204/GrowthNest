const prisma = require('../prisma/client');

const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }

    const { lessonId } = req.body;
    if (!lessonId) {
      return res.status(400).json({ message: 'lessonId is required' });
    }

    // Update the lesson with the new video URL
    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: { content: req.file.path }, // Cloudinary URL is in req.file.path
    });

    return res.status(200).json({
      message: 'Video uploaded successfully',
      url: req.file.path,
      lesson,
    });
  } catch (error) {
    console.error('Upload video error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    return res.status(500).json({ message: 'Unable to upload video' });
  }
};

const uploadAssignment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No document file provided' });
    }

    const { assignmentId, content } = req.body;
    if (!assignmentId) {
      return res.status(400).json({ message: 'assignmentId is required' });
    }

    const submission = await prisma.submission.upsert({
      where: {
        assignmentId_userId: {
          userId: req.user.id,
          assignmentId: assignmentId,
        }
      },
      update: {
        fileUrl: req.file.path,
        content: content !== undefined ? content : undefined,
      },
      create: {
        userId: req.user.id,
        assignmentId: assignmentId,
        fileUrl: req.file.path,
        content: content || null,
        status: 'SUBMITTED'
      }
    });

    return res.status(200).json({
      message: 'Assignment uploaded successfully',
      url: req.file.path,
      submission,
    });
  } catch (error) {
    console.error('Upload assignment error:', error);
    return res.status(500).json({ message: 'Unable to upload assignment' });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Update user avatar
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: req.file.path },
    });

    return res.status(200).json({
      message: 'Avatar uploaded successfully',
      url: req.file.path,
      user: {
        id: user.id,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    return res.status(500).json({ message: 'Unable to upload avatar' });
  }
};

module.exports = {
  uploadVideo,
  uploadAssignment,
  uploadAvatar,
};
