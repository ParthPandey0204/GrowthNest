const { body } = require('express-validator');

const validRoles = ['MENTOR', 'STUDENT'];

const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be 100 characters or fewer'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('A valid email is required')
    .normalizeEmail(),
  body('password')
    .isString()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('role')
    .optional()
    .isIn(validRoles)
    .withMessage(`Role must be one of: ${validRoles.join(', ')}`),
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('A valid email is required')
    .normalizeEmail(),
  body('password').isString().notEmpty().withMessage('Password is required'),
];

module.exports = {
  registerValidation,
  loginValidation,
  validRoles,
};
