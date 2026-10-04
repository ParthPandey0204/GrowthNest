const prisma = require('../prisma/client');

const getMentorStats = async (req, res) => {
  try {
    const mentorId = req.user.id;

    const programs = await prisma.program.findMany({
      where: { mentorId },
      include: {
        enrollments: true,
      }
    });

    const sessionCount = await prisma.session.count({
      where: { mentorId }
    });

    const [assignments, sessions] = await Promise.all([
      prisma.assignment.findMany({ where: { program: { mentorId } }, include: { submissions: { select: { id: true } }, program: { select: { id: true } } } }),
      prisma.session.findMany({ where: { mentorId }, include: { _count: { select: { attendees: true } } } }),
    ]);

    let totalLearners = 0;
    let revenue = 0;
    let totalProgress = 0;
    let totalEnrollmentsWithProgress = 0;

    programs.forEach(program => {
      const price = program.price ? parseFloat(program.price.toString()) : 0;
      totalLearners += program.enrollments.length;
      
      program.enrollments.forEach(enrollment => {
        revenue += price;
        totalProgress += enrollment.progress || 0;
        totalEnrollmentsWithProgress++;
      });
    });

    const avgCompletion = totalEnrollmentsWithProgress > 0 
      ? Math.round(totalProgress / totalEnrollmentsWithProgress) 
      : 0;
    const activeLearners = programs.reduce((total, program) => total + program.enrollments.filter((enrollment) => enrollment.status === 'ACTIVE').length, 0);
    const engagedLearners = programs.reduce((total, program) => total + program.enrollments.filter((enrollment) => enrollment.progress > 0).length, 0);
    const expectedSubmissions = assignments.reduce((total, assignment) => total + (programs.find((program) => program.id === assignment.program?.id)?.enrollments.length || 0), 0);
    const submittedAssignments = assignments.reduce((total, assignment) => total + assignment.submissions.length, 0);
    const assignmentCompletionRate = expectedSubmissions ? Math.round((submittedAssignments / expectedSubmissions) * 100) : 0;
    const averageSessionAttendance = sessions.length ? Math.round(sessions.reduce((total, session) => total + session._count.attendees, 0) / sessions.length) : 0;
    const completedSessions = sessions.filter((session) => session.status === 'COMPLETED').length;

    res.status(200).json({
      stats: {
        totalLearners,
        revenue,
        sessionCount,
        avgCompletion,
      },
      progressPulse: [
        { id: 'engagement', label: 'Learner engagement', value: `${totalLearners ? Math.round((engagedLearners / totalLearners) * 100) : 0}% learners in progress`, trend: 'stable' },
        { id: 'assignments', label: 'Assignment submissions', value: `${assignmentCompletionRate}% submitted`, trend: 'stable' },
        { id: 'attendance', label: 'Session attendance', value: `${averageSessionAttendance} average attendees`, trend: 'stable' },
      ],
      snapshot: [
        { id: 'active-learners', label: 'Active learners', value: activeLearners, hint: 'Currently enrolled' },
        { id: 'completion', label: 'Average progress', value: `${avgCompletion}%`, hint: 'Across all enrolments' },
        { id: 'sessions', label: 'Completed sessions', value: completedSessions, hint: `${sessionCount} total sessions` },
      ],
      insight: {
        text: totalLearners ? `${activeLearners} active learners are currently enrolled across ${programs.length} program${programs.length === 1 ? '' : 's'}.` : 'Create a program and enrol learners to start seeing growth insights.',
        timeframe: 'your current workspace data',
      },
    });
  } catch (error) {
    console.error('Get mentor stats error:', error);
    res.status(500).json({ message: 'Failed to fetch mentor stats', error: error.message });
  }
};

const getMentorContent = async (req, res) => {
  try {
    const programs = await prisma.program.findMany({
      where: { mentorId: req.user.id },
      select: { id: true, title: true, status: true, updatedAt: true, lessons: { select: { id: true, title: true, type: true, content: true, updatedAt: true }, orderBy: { order: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
    });
    return res.status(200).json({ programs });
  } catch (error) {
    console.error('Get mentor content error:', error);
    return res.status(500).json({ message: 'Unable to fetch mentor content' });
  }
};

const getMentorStudents = async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { program: { mentorId: req.user.id } },
      select: { progress: true, status: true, enrolledAt: true, user: { select: { id: true, name: true, email: true, avatar: true } }, program: { select: { id: true, title: true } } },
      orderBy: { enrolledAt: 'desc' },
    });
    return res.status(200).json({ enrollments });
  } catch (error) {
    console.error('Get mentor students error:', error);
    return res.status(500).json({ message: 'Unable to fetch students' });
  }
};

module.exports = {
  getMentorStats,
  getMentorContent,
  getMentorStudents,
};
