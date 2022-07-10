/* eslint-disable no-underscore-dangle */
const catchAsync = require('../../helpers/error/catchAsyncError');
const PostService = require('../../services/post.service');
const RootService = require('../../services/root.service');

const { appLogger } = require('../../helpers/logger/appLogger');
const {
  sendSuccessResponse, sendErrorResponse, HTTP_NOT_FOUND,
} = require('../../utils/httpResponse');
const PostModel = require('../../database/models/post.model');

const createPost = catchAsync(async (req, res) => {
  const post = await PostService.createNewPost(req.userId, req.body);
  appLogger.info(`User created a new post ${req.userId}`);
  return sendSuccessResponse(res, post);
});

const updatePostContent = catchAsync(async (req, res) => {
  const updatedPost = await RootService.updateDataById(PostModel, req.params.postId, req.body);
  if (!updatedPost) return sendErrorResponse(res, HTTP_NOT_FOUND, 'Post Not Found!');

  appLogger.info(`Post Updated ${req.params.postId}`);
  return sendSuccessResponse(res, updatedPost);
});

module.exports = {
  createPost,
  updatePostContent,
};
