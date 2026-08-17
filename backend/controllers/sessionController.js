const sessionService = require('../services/sessionService');

const respond = async (res, action, successStatus, successBody) => {
  try {
    const result = await action();
    return res.status(successStatus).json(successBody(result));
  } catch (error) {
    console.error('Session error:', error);
    return res.status(error.statusCode || 500).json({ message: error.statusCode ? error.message : 'Unable to process the session request' });
  }
};

const scheduleSession = (req, res) => respond(
  res,
  () => sessionService.createSession(req.user.id, req.body),
  201,
  (session) => ({ message: 'Session scheduled successfully', session })
);

const getSessions = (req, res) => respond(res, () => sessionService.listSessions(req.user, req.query), 200, (sessions) => sessions);

const updateSession = (req, res) => respond(
  res,
  () => sessionService.updateSession(req.params.id, req.user, req.body),
  200,
  (session) => ({ message: 'Session updated successfully', session })
);

const deleteSession = (req, res) => respond(
  res,
  () => sessionService.deleteSession(req.params.id, req.user),
  200,
  () => ({ message: 'Session deleted successfully' })
);

const attendSession = (req, res) => respond(
  res,
  () => sessionService.attendSession(req.params.id, req.user.id),
  200,
  (session) => ({ message: 'Attendance marked successfully', session })
);

module.exports = { scheduleSession, getSessions, updateSession, deleteSession, attendSession };
