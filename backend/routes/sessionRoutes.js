const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const sessionController = require('../controllers/sessionController');

router.post('/', authMiddleware, roleMiddleware('MENTOR', 'ADMIN'), sessionController.scheduleSession);
router.get('/', authMiddleware, sessionController.getSessions);

module.exports = router;
