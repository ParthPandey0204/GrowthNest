const { body } = require('express-validator');

const createSubmissionValidation = [
  body('assignmentId')
    .trim()
    .notEmpty()
    .withMessage('assignmentId is required'),
  body('content')
    .optional({ values: 'null' })
    .isString()
    .withMessage('content must be a string'),
  body('fileUrl')
    .optional({ values: 'null' })
    .isString()
    .withMessage('fileUrl must be a string'),
];

const reviewSubmissionValidation = [
  body('grade')
    .optional({ values: 'null' })
    .isFloat({ min: 0 })
    .withMessage('Grade/score must be a non-negative number')
    .toFloat(),
  body('score')
    .optional({ values: 'null' })
    .isFloat({ min: 0 })
    .withMessage('Grade/score must be a non-negative number')
    .toFloat(),
  body('feedback')
    .optional({ values: 'null' })
    .isString()
    .withMessage('Feedback must be a string'),
  body('status')
    .optional()
    .isIn(['REVIEWED', 'RETURNED'])
    .withMessage('Status must be one of: REVIEWED, RETURNED'),
];

module.exports = {
  createSubmissionValidation,
  reviewSubmissionValidation,
};
