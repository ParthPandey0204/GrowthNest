const learnerEnrollmentWhere = (userId, programId) => ({
  ...(userId && { userId }),
  ...(programId && { programId }),
  status: { in: ['ACTIVE', 'COMPLETED'] },
});

module.exports = { learnerEnrollmentWhere };
