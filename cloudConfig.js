if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); // Load environment variables
}

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  timeout: 60000 // 60 seconds timeout
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
      folder: 'wanderlust_DEV',
      allowedFormats: ["png", "jpeg", "jpg"],
  },
});

module.exports = { cloudinary, storage };


