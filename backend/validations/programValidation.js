const { body, query } = require('express-validator');

const createProgramValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must be 200 characters or fewer'),
  body('description')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description must be 5000 characters or fewer'),
  body('price')
    .optional({ values: 'null' })
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('thumbnail')
    .optional({ values: 'falsy' })
    .trim()
    .isURL()
    .withMessage('Thumbnail must be a valid URL'),
];

const updateProgramValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title must be 200 characters or fewer'),
  body('description')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description must be 5000 characters or fewer'),
  body('price')
    .optional({ values: 'null' })
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('thumbnail')
    .optional({ values: 'falsy' })
    .trim()
    .isURL()
    .withMessage('Thumbnail must be a valid URL'),
  body('status')
    .optional()
    .isIn(['DRAFT', 'ACTIVE', 'ARCHIVED'])
    .withMessage('Status must be one of: DRAFT, ACTIVE, ARCHIVED'),
];

const listProgramsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
];

module.exports = {
  createProgramValidation,
  updateProgramValidation,
  listProgramsValidation,
};
