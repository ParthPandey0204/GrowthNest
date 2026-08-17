const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const sessionController = require('../controllers/sessionController');
const handleValidation = require('../middleware/validationMiddleware');
const { scheduleSessionValidation, updateSessionValidation, listSessionsValidation } = require('../validations/sessionValidation');

router.post('/', authMiddleware, roleMiddleware('MENTOR', 'ADMIN'), scheduleSessionValidation, handleValidation, sessionController.scheduleSession);
router.get('/', authMiddleware, listSessionsValidation, handleValidation, sessionController.getSessions);
router.put('/:id', authMiddleware, roleMiddleware('MENTOR', 'ADMIN'), updateSessionValidation, handleValidation, sessionController.updateSession);
router.delete('/:id', authMiddleware, roleMiddleware('MENTOR', 'ADMIN'), sessionController.deleteSession);
router.post('/:id/attend', authMiddleware, sessionController.attendSession);

module.exports = router;
