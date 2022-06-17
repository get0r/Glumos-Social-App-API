const { HTTP_NOT_FOUND } = require('../../utils/httpResponse');
const BaseError = require('./BaseError');

module.exports = class NotFoundError extends BaseError {
  constructor(description = 'not found error') {
    super('Not Found Error', HTTP_NOT_FOUND, true, description);
  }
};
