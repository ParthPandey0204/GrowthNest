const prisma = require('../prisma/client');
const { mentorPublicSelect } = require('./programService');
const { learnerEnrollmentWhere } = require('./enrollmentAccess');

const isConfiguredCloudinaryUrl = (value) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName || typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'res.cloudinary.com' && url.pathname.startsWith(`/${cloudName}/`) && !url.username && !url.password;
  } catch {
    return false;
  }
};

const submitAssignment = async (userId, { assignmentId, content, fileUrl, file }) => {
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
  });

  if (!assignment) {
    const error = new Error('Assignment not found');
    error.statusCode = 404;
    throw error;
  }
  if (assignment.status !== 'PUBLISHED' || (assignment.programId && !(await prisma.program.findFirst({ where: { id: assignment.programId, status: 'ACTIVE' }, select: { id: true } })))) {
    const error = new Error('Assignment is not available'); error.statusCode = 404; throw error;
  }
  if (assignment.dueAt && assignment.dueAt < new Date()) { const error = new Error('The due date has passed'); error.statusCode = 400; throw error; }
  if (assignment.programId && !(await prisma.enrollment.findFirst({ where: learnerEnrollmentWhere(userId, assignment.programId), select: { id: true } }))) { const error = new Error('You must be enrolled to submit this assignment'); error.statusCode = 403; throw error; }

  let uploadedFileUrl = fileUrl || null;
  if (file) {
    uploadedFileUrl = `/uploads/${file.filename}`;
  }
  if (fileUrl && !isConfiguredCloudinaryUrl(fileUrl)) { const error = new Error('fileUrl must be a Cloudinary URL from the configured account'); error.statusCode = 400; throw error; }

  if (!content && !uploadedFileUrl) {
    const error = new Error('Either content, fileUrl, or a file upload is required');
    error.statusCode = 400;
    throw error;
  }

  const previous = await prisma.submission.findUnique({ where: { assignmentId_userId: { assignmentId, userId } } });
  if (previous?.status === 'REVIEWED') { const error = new Error('A reviewed submission cannot be replaced'); error.statusCode = 409; throw error; }
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
      grade: null, feedback: null, reviewedAt: null,
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

  if (!assignment.program || assignment.program.mentorId !== userId) {
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
    !existingSubmission.assignment.program ||
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
