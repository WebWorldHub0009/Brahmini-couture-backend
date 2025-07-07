const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'brahmani-couture',
    allowed_formats: ['jpeg', 'png', 'jpg', 'webp'],
  },
});

const upload = multer({ storage });

module.exports = upload;
