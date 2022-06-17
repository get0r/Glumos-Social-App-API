const { HTTP_BAD_REQUEST } = require('../../utils/httpResponse');
const BaseError = require('./BaseError');

module.exports = class ValidationError extends BaseError {
  constructor(description = 'Validation error') {
    super('Validation Error', HTTP_BAD_REQUEST, true, description);
  }
};
