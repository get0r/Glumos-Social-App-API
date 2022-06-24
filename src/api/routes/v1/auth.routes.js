const express = require('express');

const { signUpSchema, signInSchema } = require('../../../database/validationSchemas/auth.joi.schema');
const { validateAsync } = require('../../middlewares/validation/joi.validator');
const { AUTH_ROUTES } = require('./constants/route.constants');

const AuthController = require('../../controller/auth.controller');

const authRouter = express.Router();

/* A post request to the route `/api/v1/auth/signup` and it is using the
`AuthValidator.validateUserSignUp` middleware and the `AuthController.userSignUp` controller. */
authRouter
  .post(AUTH_ROUTES.SIGNUP, validateAsync(signUpSchema), AuthController.userSignUp);

/* A post request to the route `/api/v1/auth/signin` and it is using the
`AuthValidator.validateUserSignIn` middleware and the `AuthController.userSignIn` controller. */
authRouter
  .post(AUTH_ROUTES.SIGNIN, validateAsync(signInSchema), AuthController.userSignIn);

authRouter
  .post(AUTH_ROUTES.FORGOT_PASSWORD, AuthController.userSignIn);

authRouter
  .post(AUTH_ROUTES.VERIFY, AuthController.userSignIn);

module.exports = authRouter;
