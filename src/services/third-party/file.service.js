const multer = require('multer');

/* Creating a middleware function that will be used to upload files to memory. */
const uploadFileToMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 5 },
});

module.exports = {
  uploadFileToMemory,
};
