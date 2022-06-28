const compression = require('compression');
const cookieParser = require('cookie-parser');
const express = require('express');
const ExpressMongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const NotFoundError = require('../../helpers/error/NotFoundError');
const errorHandler = require('../../api/middlewares/error/errorHandler');
const clientErrorHandler = require('../../api/middlewares/error/clientErrorHandler');
const apiRoutes = require('../../api/routes');

const { httpLogger } = require('../../helpers/logger/appLogger');

module.exports = (app) => {
  app.use(express.json());
  app.use(morgan('dev'));

  //  gzip for response compression.
  app.use(compression());
  //  cookie to req.cookies.
  app.use(cookieParser());

  // SECURITY

  //  helmet for header security.
  app.use(helmet());

  //  strip any database related chars from requests for security.
  app.use(ExpressMongoSanitize());

  app.use(cors());

  //  network traffic logger.
  app.use(httpLogger);

  // APPLICATION ROUTES
  // ---test route
  app.get('/ping', (req, res) => res.send({
    status: 'Healthy',
  }));

  // ---all routes
  //  connect all app routes version 1.
  app.use('/api', apiRoutes);

  // ---non existent route
  app.all('*', (req, res, next) => {
    next(
      new NotFoundError(`path ${req.originalUrl} not found.`),
    );
  });

  //  central error handler middleware.
  app.use(errorHandler);

  //  client response sender middleware in time of error.
  app.use(clientErrorHandler);
};
