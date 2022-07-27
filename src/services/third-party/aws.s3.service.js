const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const {
  s3AccessKey, s3SecretKey, s3Location, s3BucketName,
} = require('../../config');
const { generateRandomChars } = require('../../utils/utilFunctions');

const S3 = new S3Client({
  credentials: {
    accessKeyId: s3AccessKey,
    secretAccessKey: s3SecretKey,
  },
  region: s3Location,
});

const uploadImageToS3 = async (posterUserId, file, fileType, isAvatar) => {
  let bucketName = s3BucketName.concat('/posts');
  if (isAvatar) {
    bucketName = s3BucketName.concat('/avatars');
  }

  const params = {
    Bucket: bucketName,
    Key: `post_image_${posterUserId}_${generateRandomChars()}`,
    Body: file,
    ContentType: fileType,
  };
  const saveFile = new PutObjectCommand(params);
  const fileU = await S3.send(saveFile);
};

module.exports = {
  uploadImageToS3,
};
