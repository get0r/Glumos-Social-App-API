const express = require('express');

const PostController = require('../../controller/post.controller');

const { validateAsync } = require('../../middlewares/validation/joi.validator');
const { ROOT_PATH, withParam, POST_ROUTES } = require('./constants/route.constants');
const { postSchema, objectIdSchema } = require('../../../database/validationSchemas/post.joi.schema');
const { authUser } = require('../../middlewares/auth/authenticate');

const postRouter = express.Router();

/* A route handler. */
postRouter
  .post(
    ROOT_PATH.ROOT,
    [authUser, validateAsync(postSchema)],
    PostController.createPost,
  );

/* A route handler. */
postRouter
  .get(
    withParam(ROOT_PATH.ROOT, 'postId'),
    [authUser, validateAsync(objectIdSchema, 'postId')],
    PostController.getSinglePost,
  );

postRouter
  .get(
    ROOT_PATH.ROOT,
    authUser,
    PostController.getAllPosts,
  );

/* A route handler. */
postRouter
  .put(
    withParam(ROOT_PATH.ROOT, 'postId'),
    [authUser, validateAsync(objectIdSchema, 'postId'), validateAsync(postSchema)],
    PostController.updatePostContent,
  );

postRouter
  .delete(
    withParam(ROOT_PATH.ROOT, 'postId'),
    [authUser, validateAsync(objectIdSchema, 'postId')],
    PostController.deletePost,
  );

postRouter
  .put(
    withParam(POST_ROUTES.LIKE, 'postId'),
    [authUser, validateAsync(objectIdSchema, 'postId')],
    PostController.likeUnlikePost,
  );

module.exports = postRouter;
