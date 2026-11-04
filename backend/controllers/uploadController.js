const prisma = require('../prisma/client');
const { learnerEnrollmentWhere } = require('../services/enrollmentAccess');

const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }

    const { lessonId } = req.body;
    if (!lessonId) {
      return res.status(400).json({ message: 'lessonId is required' });
    }

    const lessonOwner = await prisma.lesson.findUnique({ where: { id: lessonId }, include: { program: { select: { mentorId: true } } } });
    if (!lessonOwner) return res.status(404).json({ message: 'Lesson not found' });
    if (lessonOwner.program.mentorId !== req.user.id) return res.status(403).json({ message: 'You can only upload videos to your own lessons' });
    if (lessonOwner.type !== 'VIDEO') return res.status(400).json({ message: 'Video uploads are only allowed for video lessons' });
    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: { videoUrl: req.file.path },
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

    const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId }, include: { program: { select: { status: true } } } });
    if (!assignment || assignment.status !== 'PUBLISHED' || (assignment.program && assignment.program.status !== 'ACTIVE')) return res.status(404).json({ message: 'Assignment not found' });
    if (assignment.dueAt && assignment.dueAt < new Date()) return res.status(400).json({ message: 'The due date has passed' });
    if (assignment.programId) {
      const enrollment = await prisma.enrollment.findFirst({ where: learnerEnrollmentWhere(req.user.id, assignment.programId), select: { id: true } });
      if (!enrollment) return res.status(403).json({ message: 'You must be enrolled to submit this assignment' });
    }
    const existing = await prisma.submission.findUnique({ where: { assignmentId_userId: { userId: req.user.id, assignmentId } } });
    if (existing?.status === 'REVIEWED') return res.status(409).json({ message: 'A reviewed submission cannot be replaced' });
    const submission = await prisma.submission.upsert({
      where: {
        assignmentId_userId: {
          userId: req.user.id,
          assignmentId: assignmentId,
        }
      },
      update: {
        fileUrl: req.file.path,
        grade: null, feedback: null, reviewedAt: null, status: 'SUBMITTED', submittedAt: new Date(),
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
