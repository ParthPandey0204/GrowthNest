const { body } = require('express-validator');

const createEnrollmentValidation = [
  body('programId')
    .trim()
    .notEmpty()
    .withMessage('Program ID is required'),
];

const updateProgressValidation = [
  body('progress')
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress must be an integer between 0 and 100')
    .toInt(),
];

module.exports = {
  createEnrollmentValidation,
  updateProgressValidation,
};
