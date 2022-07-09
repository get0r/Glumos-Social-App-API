const express = require('express');

const AuthController = require('../../controller/auth.controller');

const { validateAsync } = require('../../middlewares/validation/joi.validator');
const { withParam, USER_ROUTES } = require('./constants/route.constants');
const { objectIdSchema } = require('../../../database/validationSchemas/post.joi.schema');
const { profileUpdateSchema } = require('../../../database/validationSchemas/user.joi.schema');
const { authUser } = require('../../middlewares/auth/authenticate');

const userRouter = express.Router();

/* A get request to the route `/api/v1/users/:userId` and it is using the
validateAsync middleware and the `AuthController.getUser` controller. */
userRouter
  .get(
    withParam(USER_ROUTES.ROOT, 'userId'),
    validateAsync(objectIdSchema, 'userId'),
    AuthController.getUser,
  );

userRouter
  .put(
    withParam(USER_ROUTES.ROOT, 'userId'),
    [authUser, validateAsync(objectIdSchema, 'userId'), validateAsync(profileUpdateSchema)],
    AuthController.getUser,
  );

module.exports = userRouter;
