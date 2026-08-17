const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Storage config for videos
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'growthnest/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'webm', 'ogg'],
  },
});

// Storage config for documents (PDF/ZIP)
// Note: Cloudinary treats zips (and often pdfs) as raw resource_type by default if not image/video
const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine resource_type based on mimetype or extension
    let resource_type = 'raw'; // Default for non-image/video
    if (file.mimetype === 'application/pdf') {
      resource_type = 'image'; // Cloudinary can process PDFs as images for previews, but 'raw' is safer if just for download
    }
    
    return {
      folder: 'growthnest/documents',
      resource_type: 'raw',
      format: file.originalname.split('.').pop(), // Force format to preserve extension for raw files
    };
  },
});

// Storage config for avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'growthnest/avatars',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

// Middleware instances
const videoUpload = multer({
  storage: videoStorage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
});

const documentUpload = multer({
  storage: documentStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.split('.').pop().toLowerCase();
    if (['pdf', 'zip'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and ZIP files are allowed'));
    }
  }
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = {
  videoUpload,
  documentUpload,
  avatarUpload,
};
