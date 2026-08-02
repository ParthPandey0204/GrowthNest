const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');

router.get('/users', authMiddleware, roleMiddleware('ADMIN'), adminController.getUsers);

module.exports = router;
