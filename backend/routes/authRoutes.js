const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const handleValidation = require('../middleware/validationMiddleware');
const { registerValidation, loginValidation } = require('../validations/authValidation');
const rateLimit = require('../middleware/rateLimit');

router.get('/me', authMiddleware, authController.getMe);
router.post('/logout', authMiddleware, authController.logout);
router.post('/register', rateLimit({ max: 8 }), registerValidation, handleValidation, authController.register);
router.post('/login', rateLimit({ max: 10 }), loginValidation, handleValidation, authController.login);

module.exports = router;
