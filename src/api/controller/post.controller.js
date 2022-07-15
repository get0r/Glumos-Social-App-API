/* eslint-disable no-underscore-dangle */
const catchAsync = require('../../helpers/error/catchAsyncError');
const PostService = require('../../services/post.service');
const RootService = require('../../services/root.service');

const { appLogger } = require('../../helpers/logger/appLogger');
const {
  sendSuccessResponse, sendErrorResponse, HTTP_NOT_FOUND,
} = require('../../utils/httpResponse');
const PostModel = require('../../database/models/post.model');
const { LikeModel } = require('../../database/models/like.model');

const createPost = catchAsync(async (req, res) => {
  const post = await PostService.createNewPost(req.userId, req.body);
  appLogger.info(`User created a new post ${req.userId}`);
  return sendSuccessResponse(res, post);
});

const getSinglePost = catchAsync(async (req, res) => {
  const post = await PostService.getPost(req.params.postId);
  if (!post) return sendErrorResponse(res, HTTP_NOT_FOUND, 'Post Not Found!');

  return sendSuccessResponse(res, post);
});

const updatePostContent = catchAsync(async (req, res) => {
  const updatedPost = await RootService.updateDataById(PostModel, req.params.postId, req.body);
  if (!updatedPost) return sendErrorResponse(res, HTTP_NOT_FOUND, 'Post Not Found!');

  appLogger.info(`Post Updated ${req.params.postId}`);
  return sendSuccessResponse(res, updatedPost);
});
const deletePost = catchAsync(async (req, res) => {
  await RootService.deleteDataByFilter(LikeModel, { postId: req.params.postId });
  const deletedPost = await RootService.deleteDataById(PostModel, req.params.postId);
  if (!deletedPost) return sendErrorResponse(res, HTTP_NOT_FOUND, 'Post Not Found!');

  appLogger.info(`Post Deleted ${req.params.postId}`);
  return sendSuccessResponse(res, deletedPost);
});

const likeUnlikePost = catchAsync(async (req, res) => {
  const likedPost = await PostService.likeUnlikePost(req.userId, req.params.postId);
  if (!likedPost) return sendErrorResponse(res, HTTP_NOT_FOUND, 'Post Not Found!');

  appLogger.info(`Post Liked/UnLiked ${req.params.postId}`);
  return sendSuccessResponse(res, likedPost);
});

module.exports = {
  createPost,
  updatePostContent,
  getSinglePost,
  deletePost,
  likeUnlikePost,
};
