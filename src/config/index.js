require('dotenv').config();

/* Exporting the variables from the .env file. */
module.exports = {
  dbURI: process.env.DB_URI,
  tokenSecret: process.env.TOKEN_SECRET,
  port: process.env.PORT,
};
