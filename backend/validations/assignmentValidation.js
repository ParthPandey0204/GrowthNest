const { body, query } = require('express-validator');

const createAssignmentValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must be 200 characters or fewer'),
  body('description')
    .optional({ values: 'null' })
    .isString()
    .withMessage('Description must be a string'),
  body('dueDate')
    .optional({ values: 'null' })
    .isISO8601()
    .withMessage('dueDate must be a valid ISO8601 date string'),
  body('programId')
    .trim()
    .notEmpty()
    .withMessage('programId is required'),
];

const listAssignmentsQueryValidation = [
  query('programId')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('programId cannot be empty'),
];

module.exports = {
  createAssignmentValidation,
  listAssignmentsQueryValidation,
};
