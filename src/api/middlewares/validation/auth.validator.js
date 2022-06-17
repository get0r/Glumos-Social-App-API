const catchAsync = require('../../../helpers/error/catchAsyncError');
const UserValidationSchema = require('../../../database/validationSchemas/auth.joi.schema');

const validateUserSignIn = catchAsync(async (req, res, next) => {
  //  asynchronously run validation.
  await UserValidationSchema
    .signInSchema.validateAsync(req.body, UserValidationSchema.schemaOptions);
  return next();
});

const validateUserSignUp = catchAsync(async (req, res, next) => {
  await UserValidationSchema
    .signUpSchema.validateAsync(req.body, UserValidationSchema.schemaOptions);
  return next();
});

module.exports = {
  validateUserSignIn,
  validateUserSignUp,
};
