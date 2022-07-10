/* eslint-disable no-underscore-dangle */
const catchAsync = require('../../helpers/error/catchAsyncError');
const PostService = require('../../services/post.service');

const { appLogger } = require('../../helpers/logger/appLogger');
const {
  sendSuccessResponse,
} = require('../../utils/httpResponse');

const createPost = catchAsync(async (req, res) => {
  const post = await PostService.createNewPost(req.userId, req.body);
  appLogger.info(`User created a new post ${req.userId}`);
  return sendSuccessResponse(res, post);
});

module.exports = {
  createPost,
};
