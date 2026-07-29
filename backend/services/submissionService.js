const prisma = require('../prisma/client');
const { mentorPublicSelect } = require('./programService');

const submitAssignment = async (userId, { assignmentId, content, fileUrl, file }) => {
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
  });

  if (!assignment) {
    const error = new Error('Assignment not found');
    error.statusCode = 404;
    throw error;
  }

  let uploadedFileUrl = fileUrl || null;
  if (file) {
    uploadedFileUrl = `/uploads/${file.filename}`;
  }

  if (!content && !uploadedFileUrl) {
    const error = new Error('Either content, fileUrl, or a file upload is required');
    error.statusCode = 400;
    throw error;
  }

  return await prisma.submission.upsert({
    where: {
      assignmentId_userId: {
        assignmentId,
        userId,
      },
    },
    update: {
      content: content || null,
      fileUrl: uploadedFileUrl,
      status: 'SUBMITTED',
      submittedAt: new Date(),
    },
    create: {
      assignmentId,
      userId,
      content: content || null,
      fileUrl: uploadedFileUrl,
      status: 'SUBMITTED',
    },
    include: {
      assignment: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });
};

const getAssignmentSubmissionsForMentor = async (assignmentId, userId) => {
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: { program: true },
  });

  if (!assignment) {
    const error = new Error('Assignment not found');
    error.statusCode = 404;
    throw error;
  }

  if (assignment.program && assignment.program.mentorId !== userId) {
    const error = new Error('Forbidden: You do not own the program for this assignment');
    error.statusCode = 403;
    throw error;
  }

  return await prisma.submission.findMany({
    where: { assignmentId },
    orderBy: { submittedAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          bio: true,
        },
      },
    },
  });
};

const getStudentSubmissions = async (userId) => {
  return await prisma.submission.findMany({
    where: { userId },
    orderBy: { submittedAt: 'desc' },
    include: {
      assignment: {
        include: {
          program: {
            include: {
              mentor: { select: mentorPublicSelect },
            },
          },
        },
      },
    },
  });
};

const reviewSubmission = async (id, userId, { grade, score, feedback, status }) => {
  const existingSubmission = await prisma.submission.findUnique({
    where: { id },
    include: {
      assignment: {
        include: {
          program: true,
        },
      },
    },
  });

  if (!existingSubmission) {
    const error = new Error('Submission not found');
    error.statusCode = 404;
    throw error;
  }

  if (
    existingSubmission.assignment.program &&
    existingSubmission.assignment.program.mentorId !== userId
  ) {
    const error = new Error('Forbidden: You do not own the program for this assignment');
    error.statusCode = 403;
    throw error;
  }

  const finalGrade = grade !== undefined ? grade : score;

  return await prisma.submission.update({
    where: { id },
    data: {
      grade: finalGrade !== undefined ? finalGrade : existingSubmission.grade,
      feedback: feedback !== undefined ? feedback : existingSubmission.feedback,
      status: status || 'REVIEWED',
      reviewedAt: new Date(),
    },
    include: {
      assignment: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });
};

module.exports = {
  submitAssignment,
  getAssignmentSubmissionsForMentor,
  getStudentSubmissions,
  reviewSubmission,
};
