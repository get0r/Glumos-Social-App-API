const express = require('express');

const PostController = require('../../controller/post.controller');

const { validateAsync } = require('../../middlewares/validation/joi.validator');
const { ROOT_PATH } = require('./constants/route.constants');
const { postSchema } = require('../../../database/validationSchemas/post.joi.schema');
const { authUser } = require('../../middlewares/auth/authenticate');

const postRouter = express.Router();

/* A route handler. */
postRouter
  .post(
    ROOT_PATH.ROOT,
    [authUser, validateAsync(postSchema)],
    PostController.createPost,
  );

module.exports = postRouter;
