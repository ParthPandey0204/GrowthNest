const deriveEnrollmentProgress = (currentStatus, completedLessons, totalLessons) => {
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const data = { progress };

  if (progress === 100 && totalLessons > 0) {
    data.status = 'COMPLETED';
    data.completedAt = new Date();
  } else if (currentStatus === 'COMPLETED') {
    data.status = 'ACTIVE';
    data.completedAt = null;
  }

  return data;
};

module.exports = { deriveEnrollmentProgress };
