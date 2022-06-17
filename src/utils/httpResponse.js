const HTTP_OK = 200;

/**
 * a function to assemble and send error message to a client.
 * @param {*} res response object
 * @param {*} httpCode status code
 * @param {*} payload message to be sent to the client.
 */
const sendErrorResponse = (res, httpCode, payload) => res.status(httpCode).json({
  success: false,
  message: payload,
});

/**
 * a function to assemble and send success message to a client.
 * @param {*} res response object
 * @param {*} httpCode status code
 * @param {*} payload message to be sent to the client.
 */
const sendSuccessResponse = (res, payload) => res.status(HTTP_OK).json({
  success: true,
  message: payload,
});

module.exports = {
  sendErrorResponse,
  sendSuccessResponse,
  HTTP_OK,
  HTTP_BAD_REQUEST: 400,
  HTTP_UNAUTHORIZED_ACCESS: 401,
  HTTP_NOT_FOUND: 404,
  HTTP_INTERNAL_ERROR: 500,
};
