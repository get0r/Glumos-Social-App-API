const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
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

/**
 * It takes a file, uploads it to S3, and returns a signed URL to the file
 * @param posterUserId - The user id of the user who is posting the image.
 * @param file - The file that you want to upload to S3.
 * @param fileType - The type of file you're uploading.
 * @param isAvatar - This is a boolean value that tells us whether the image is an avatar or not.
 * @returns A signed URL that will expire in 24 hours.
 */
const uploadImageToS3 = async (posterUserId, file, fileType, isAvatar) => {
  let fileName = `posts/post_image_${posterUserId}_${generateRandomChars()}`;
  if (isAvatar) {
    fileName = `avatars/post_image_${posterUserId}_${generateRandomChars()}`;
  }

  const params = {
    Bucket: s3BucketName,
    Key: fileName,
    Body: file,
    ContentType: fileType,
  };

  const saveFile = new PutObjectCommand(params);
  await S3.send(saveFile);
  const getCommand = new GetObjectCommand(params);
  const imgLink = await getSignedUrl(S3, getCommand, { expiresIn: 3600 * 24 });
  return { imgLink, imgKey: fileName };
};

/**
 * It takes an array of images, a userId, and a boolean value, and returns an array of signed URLs
 * @param images - an array of images
 * @param userId - The userId of the user who is uploading the image.
 * @param isAvatar - boolean
 * @returns An array of signed urls
 */
const uploadImagesToS3 = async (images, userId, isAvatar) => {
  const imgsLink = [];
  const imgsKey = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const image of images) {
    const { imgLink, imgKey } = await uploadImageToS3(
      userId,
      image.buffer,
      image.mimetype,
      isAvatar,
    );
    imgsLink.push(imgLink);
    imgsKey.push(imgKey);
  }

  return { imgsLink, imgsKey };
};

module.exports = {
  uploadImageToS3,
  uploadImagesToS3,
};
