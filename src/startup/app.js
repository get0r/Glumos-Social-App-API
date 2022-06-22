const express = require('express');

const setupExpress = require('./api/setup.express');
const setupMongooseDatabase = require('./database/setup.mongoose');

const app = express();

/* Setting up the database and the express server. */
setupMongooseDatabase();
setupExpress(app);

module.exports = app;
