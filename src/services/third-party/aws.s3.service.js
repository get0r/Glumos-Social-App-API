const Aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const {
  s3AccessKey, s3SecretKey, s3Location, s3BucketName,
} = require('../../config');

Aws.config.update({
  accessKeyId: s3AccessKey,
  secretAccessKey: s3SecretKey,
  region: s3Location,
});

const S3Client = new Aws.S3();

const uploadImage = multer({
  storage: multerS3({
    s3: S3Client,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    bucket: s3BucketName,
    key: (req, file, cb) => {
      console.log(file);
      cb(null, file.originalname);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

module.exports = {
  uploadImage,
};
