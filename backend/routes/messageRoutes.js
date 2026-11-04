const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const handleValidation = require('../middleware/validationMiddleware');
const controller = require('../controllers/programMessageController');
const {
  createAnnouncementValidation,
  createQuestionValidation,
  createReplyValidation,
  resolveValidation,
  listMessagesValidation,
} = require('../validations/programMessageValidation');

router.use(authMiddleware, roleMiddleware('MENTOR', 'STUDENT'));
router.get('/programs', controller.listPrograms);
router.get('/programs/:programId', listMessagesValidation, handleValidation, controller.listMessages);
router.post('/programs/:programId/announcements', roleMiddleware('MENTOR'), createAnnouncementValidation, handleValidation, controller.createAnnouncement);
router.post('/programs/:programId/questions', createQuestionValidation, handleValidation, controller.createQuestion);
router.post('/programs/:programId/questions/:messageId/replies', createReplyValidation, handleValidation, controller.createReply);
router.patch('/programs/:programId/questions/:messageId/resolved', roleMiddleware('MENTOR'), resolveValidation, handleValidation, controller.setQuestionResolved);

module.exports = router;
