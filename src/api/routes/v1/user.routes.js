const express = require('express');

const { validateAsync } = require('../../middlewares/validation/joi.validator');
const { withParam, USER_ROUTES } = require('./constants/route.constants');
const { objectIdSchema } = require('../../../database/validationSchemas/post.joi.schema');

const AuthController = require('../../controller/auth.controller');

const userRouter = express.Router();

/* A get request to the route `/api/v1/users/:userId` and it is using the
validateAsync middleware and the `AuthController.getUser` controller. */
userRouter
  .get(
    withParam(USER_ROUTES.ROOT, 'userId'),
    validateAsync(objectIdSchema, 'userId'),
    AuthController.getUser,
  );

module.exports = userRouter;
