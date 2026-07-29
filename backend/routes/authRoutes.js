const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const handleValidation = require('../middleware/validationMiddleware');
const { registerValidation, loginValidation } = require('../validations/authValidation');

router.get('/me', authMiddleware, authController.getMe);
router.post('/register', registerValidation, handleValidation, authController.register);
router.post('/login', loginValidation, handleValidation, authController.login);

module.exports = router;
