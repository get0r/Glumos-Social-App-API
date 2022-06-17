const express = require('express');

const AuthController = require('../../controller/auth.controller');
const AuthValidator = require('../../middlewares/validation/auth.validator');

const { USER_ROUTES } = require('../../../helpers/constants/route.constants');

const authRouter = express.Router();

authRouter
  .post(USER_ROUTES.SIGNUP, AuthValidator.validateUserSignUp, AuthController.userSignUp);

authRouter
  .post(USER_ROUTES.SIGNIN, AuthValidator.validateUserSignIn, AuthController.userSignIn);

module.exports = authRouter;
