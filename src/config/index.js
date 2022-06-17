require('dotenv').config();

module.exports = {
  dbURI: process.env.DB_URI,
  tokenSecret: process.env.TOKEN_SECRET,
  port: process.env.PORT,
};
