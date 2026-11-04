const { body, query } = require('express-validator');

const createAnnouncementValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 160 }).withMessage('Title must be 160 characters or fewer'),
  body('body').trim().notEmpty().withMessage('Announcement text is required').isLength({ max: 10000 }).withMessage('Announcement must be 10000 characters or fewer'),
];

const createQuestionValidation = [
  body('title').trim().notEmpty().withMessage('Question title is required').isLength({ max: 200 }).withMessage('Title must be 200 characters or fewer'),
  body('body').trim().notEmpty().withMessage('Question details are required').isLength({ max: 10000 }).withMessage('Question must be 10000 characters or fewer'),
];

const createReplyValidation = [
  body('body').trim().notEmpty().withMessage('Reply is required').isLength({ max: 5000 }).withMessage('Reply must be 5000 characters or fewer'),
];

const resolveValidation = [body('isResolved').isBoolean().withMessage('isResolved must be true or false').toBoolean()];
const listMessagesValidation = [query('limit').optional().isInt({ min: 1, max: 100 }).toInt()];

module.exports = { createAnnouncementValidation, createQuestionValidation, createReplyValidation, resolveValidation, listMessagesValidation };
