const catchAsync = require('../../../helpers/error/catchAsyncError');
const UserValidationSchema = require('../../../database/validationSchemas/auth.joi.schema');

const validateAsync = (validationSchema, paramName) => catchAsync(async (req, res, next) => {
  //  asynchronously run validation.
  await validationSchema.validateAsync(paramName ? req.params[paramName]
    : req.body, UserValidationSchema.schemaOptions);
  return next();
});

module.exports = {
  validateAsync,
};
