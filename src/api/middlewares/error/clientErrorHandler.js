const NotFoundError = require('../../../helpers/error/NotFoundError');
const ValidationError = require('../../../helpers/error/ValidationError');
const { sendErrorResponse, HTTP_INTERNAL_ERROR } = require('../../../utils/httpResponse');

/**
 * a middleware to return error response to the client.
 * @param {Error} err error object catch from controller
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next routing function
 */
const clientErrorHandler = (err, req, res, next) => {
  switch (err.constructor) {
    case ValidationError:
      return sendErrorResponse(res, err.httpCode, 'Invalid input was given.');
    case NotFoundError:
      return sendErrorResponse(res, err.httpCode, 'Not Found Error');
    default:
      return sendErrorResponse(res, HTTP_INTERNAL_ERROR, 'Sorry! something went wrong.');
  }
};

module.exports = clientErrorHandler;
