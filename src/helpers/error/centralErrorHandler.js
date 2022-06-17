const _ = require('lodash');

const BaseError = require('./BaseError');
const serverTerminator = require('../../utils/serverTerminator');
const { appLogger } = require('../logger/appLogger');

const isErrorOperational = (err) => {
  if (err instanceof BaseError) {
    return err.isOperational;
  }
  return false;
};

const centralErrorHandler = (err) => {
  // assemble the error for logging
  const error = {
    type: err.constructor.name,
    message: err.message,
    stack: err.stack,
  };

  if (isErrorOperational(err)) {
    return appLogger.warn(JSON.stringify(_.pick(error, ['type', 'message'])));
  }
  appLogger.error(JSON.stringify(error));
  //  send message notification email(sms).
  //  restart gracefully.
  return serverTerminator();
};

module.exports = centralErrorHandler;
