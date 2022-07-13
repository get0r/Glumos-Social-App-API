const express = require('express');

const AuthController = require('../../controller/auth.controller');
const UserController = require('../../controller/user.controller');

const { validateAsync } = require('../../middlewares/validation/joi.validator');
const { withParam, ROOT_PATH } = require('./constants/route.constants');
const { objectIdSchema } = require('../../../database/validationSchemas/post.joi.schema');
const { profileUpdateSchema } = require('../../../database/validationSchemas/user.joi.schema');
const { authUser } = require('../../middlewares/auth/authenticate');

const userRouter = express.Router();

userRouter
  .get(
    ROOT_PATH.ROOT,
    [authUser, validateAsync(objectIdSchema, 'userId'), validateAsync(profileUpdateSchema)],
    UserController.getUsers,
  );

/* A get request to the route `/api/v1/users/:userId` and it is using the
validateAsync middleware and the `AuthController.getUser` controller. */
userRouter
  .get(
    withParam(ROOT_PATH.ROOT, 'userId'),
    [authUser, validateAsync(objectIdSchema, 'userId')],
    AuthController.getUser,
  );

/* A put request to the route `/api/v1/users/:userId` and it is using the
validateAsync middleware and the `UserController.updateProfile` controller. */

userRouter
  .put(
    withParam(ROOT_PATH.ROOT, 'userId'),
    [authUser, validateAsync(objectIdSchema, 'userId'), validateAsync(profileUpdateSchema)],
    UserController.updateProfile,
  );

module.exports = userRouter;
