const service = require('../services/programMessageService');

const respond = (action, status = 200) => async (req, res) => {
  try {
    const data = await action(req);
    return res.status(status).json(data);
  } catch (error) {
    console.error('Program message error:', error);
    return res.status(error.statusCode || 500).json({ message: error.statusCode ? error.message : 'Unable to process the discussion request' });
  }
};

module.exports = {
  listPrograms: respond((req) => service.listPrograms(req.user)),
  listMessages: respond((req) => service.listMessages(req.params.programId, req.user, Number(req.query.limit) || 50)),
  createAnnouncement: respond((req) => service.createAnnouncement(req.params.programId, req.user.id, req.body), 201),
  createQuestion: respond((req) => service.createQuestion(req.params.programId, req.user, req.body), 201),
  createReply: respond((req) => service.createReply(req.params.programId, req.params.messageId, req.user, req.body.body), 201),
  setQuestionResolved: respond((req) => service.setQuestionResolved(req.params.programId, req.params.messageId, req.user.id, req.body.isResolved)),
};
