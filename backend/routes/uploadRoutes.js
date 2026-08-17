const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { videoUpload, documentUpload, avatarUpload } = require('../middleware/upload');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Video upload (Mentor only)
router.post(
  '/video',
  authMiddleware,
  roleMiddleware('MENTOR'),
  videoUpload.single('file'),
  uploadController.uploadVideo
);

// Assignment upload (Student only)
router.post(
  '/assignment',
  authMiddleware,
  roleMiddleware('STUDENT'),
  documentUpload.single('file'),
  uploadController.uploadAssignment
);

// Avatar upload (Any authenticated user)
router.post(
  '/avatar',
  authMiddleware,
  avatarUpload.single('file'),
  uploadController.uploadAvatar
);

module.exports = router;
