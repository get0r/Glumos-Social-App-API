const express = require('express');

const setupExpress = require('./api/setup.express');
const setupMongooseDatabase = require('./database/setup.mongoose');

const app = express();

setupMongooseDatabase();
setupExpress(app);

module.exports = app;
