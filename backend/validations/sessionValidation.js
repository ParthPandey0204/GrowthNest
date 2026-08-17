const { body, query } = require('express-validator');

const sessionStatuses = ['SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED'];

const scheduleSessionValidation = [
  body('title').trim().notEmpty().isLength({ max: 200 }),
  body('scheduledAt').isISO8601().withMessage('scheduledAt must be a valid date'),
  body('duration').isInt({ min: 1, max: 1440 }).withMessage('duration must be between 1 and 1440 minutes').toInt(),
  body('meetLink').optional({ values: 'falsy' }).isURL().withMessage('meetLink must be a valid URL'),
  body('programId').optional({ values: 'falsy' }).isString().trim(),
];

const updateSessionValidation = [
  body('title').optional().trim().notEmpty().isLength({ max: 200 }),
  body('scheduledAt').optional().isISO8601().withMessage('scheduledAt must be a valid date'),
  body('duration').optional().isInt({ min: 1, max: 1440 }).withMessage('duration must be between 1 and 1440 minutes').toInt(),
  body('meetLink').optional({ values: 'null' }).isURL().withMessage('meetLink must be a valid URL'),
  body('status').optional().isIn(sessionStatuses),
];

const listSessionsValidation = [
  query('programId').optional().isString().trim(),
  query('mentorId').optional().isString().trim(),
  query('status').optional().isIn(sessionStatuses),
];

module.exports = { scheduleSessionValidation, updateSessionValidation, listSessionsValidation };
