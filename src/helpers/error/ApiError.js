const { HTTP_INTERNAL_ERROR } = require('../../utils/httpResponse');
const BaseError = require('./BaseError');

module.exports = class ApiError extends BaseError {
  constructor(description = 'internal server error') {
    super('API Error', HTTP_INTERNAL_ERROR, true, description);
  }
};
