require('dotenv').config();

/* Exporting the variables from the .env file. */
module.exports = {
  dbURI: process.env.DB_URI,
  rootDomain: process.env.ROOT_DOMAIN,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  port: process.env.PORT,
  mailgunAPIKEY: process.env.MAILGUN_API_KEY,
  mailgunDomain: process.env.MAILGUN_DOMAIN,
  s3BucketName: process.env.S3_BUCKET_NAME,
  s3Location: process.env.S3_LOCATION,
  s3AccessKey: process.env.S3_ACCESS_KEY,
  s3SecretKey: process.env.S3_SECRET_KEY,
};
