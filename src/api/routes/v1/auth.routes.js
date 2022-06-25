const express = require('express');

const { signUpSchema, signInSchema } = require('../../../database/validationSchemas/auth.joi.schema');
const { validateAsync } = require('../../middlewares/validation/joi.validator');
const { AUTH_ROUTES, withParam } = require('./constants/route.constants');
const { objectIdSchema } = require('../../../database/validationSchemas/post.joi.schema');

const AuthController = require('../../controller/auth.controller');

const authRouter = express.Router();

/* A post request to the route `/api/v1/auth/signup` and it is using the
validateAsync middleware and the `AuthController.userSignUp` controller. */
authRouter
  .post(AUTH_ROUTES.SIGNUP, validateAsync(signUpSchema), AuthController.userSignUp);

/* A post request to the route `/api/v1/auth/signin` and it is using the
validateAsync middleware and the `AuthController.userSignIn` controller. */
authRouter
  .post(AUTH_ROUTES.SIGNIN, validateAsync(signInSchema), AuthController.userSignIn);

/* A get request to the route `/api/v1/auth/verify/:verificationToken` and it is using the
validateAsync middleware and the `AuthController.verifyUser` controller. */
authRouter
  .get(withParam(AUTH_ROUTES.VERIFY, 'verificationToken'), validateAsync(objectIdSchema, 'verificationToken'), AuthController.verifyUser);

authRouter
  .post(AUTH_ROUTES.FORGOT_PASSWORD, AuthController.userSignIn);

module.exports = authRouter;
