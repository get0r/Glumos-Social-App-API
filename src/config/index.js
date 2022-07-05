require('dotenv').config();

/* Exporting the variables from the .env file. */
module.exports = {
  dbURI: process.env.DB_URI,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  port: process.env.PORT,
  mailgunAPIKEY: process.env.MAILGUN_API_KEY,
  mailgunDomain: process.env.MAILGUN_DOMAIN,
};
