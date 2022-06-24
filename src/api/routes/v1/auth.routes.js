const express = require('express');

const AuthController = require('../../controller/auth.controller');
const AuthValidator = require('../../middlewares/validation/auth.validator');

const { AUTH_ROUTES } = require('./constants/route.constants');

const authRouter = express.Router();

/* A post request to the route `/api/v1/auth/signup` and it is using the
`AuthValidator.validateUserSignUp` middleware and the `AuthController.userSignUp` controller. */
authRouter
  .post(AUTH_ROUTES.SIGNUP, AuthValidator.validateUserSignUp, AuthController.userSignUp);

/* A post request to the route `/api/v1/auth/signin` and it is using the
`AuthValidator.validateUserSignIn` middleware and the `AuthController.userSignIn` controller. */
authRouter
  .post(AUTH_ROUTES.SIGNIN, AuthValidator.validateUserSignIn, AuthController.userSignIn);

authRouter
  .post(AUTH_ROUTES.FORGOT_PASSWORD, AuthValidator.validateUserSignIn, AuthController.userSignIn);

authRouter
  .post(AUTH_ROUTES.VERIFY, AuthValidator.validateUserSignIn, AuthController.userSignIn);

module.exports = authRouter;
