const { body } = require('express-validator');

const validLessonTypes = ['VIDEO', 'ARTICLE', 'LIVE', 'ASSIGNMENT'];

const createLessonValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must be 200 characters or fewer'),
  body('content')
    .optional({ values: 'null' })
    .isString()
    .withMessage('Content must be a string'),
  body('type')
    .optional()
    .isIn(validLessonTypes)
    .withMessage(`Type must be one of: ${validLessonTypes.join(', ')}`),
  body('order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer')
    .toInt(),
];

module.exports = {
  createLessonValidation,
  validLessonTypes,
};
