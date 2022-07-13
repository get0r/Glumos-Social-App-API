/* eslint-disable no-underscore-dangle */
const catchAsync = require('../../helpers/error/catchAsyncError');
const AuthServices = require('../../services/auth.service');
const RootServices = require('../../services/root.service');
const UserModel = require('../../database/models/user.model');

const { appLogger } = require('../../helpers/logger/appLogger');
const {
  sendErrorResponse,
  sendSuccessResponse,
  HTTP_NOT_FOUND,
} = require('../../utils/httpResponse');

const getUsers = catchAsync(async (req, res) => {
  const users = await RootServices.getOperatedData(
    UserModel,
    req.query,
    req.query.sort,
    req.query.page,
  );

  return sendSuccessResponse(res, users);
});

const updateProfile = catchAsync(async (req, res) => {
  const user = await AuthServices.getUser(req.params.userId);
  if (!user) return sendErrorResponse(res, HTTP_NOT_FOUND, 'User Not Found!');

  await AuthServices.updateUser(user._id, req.body);

  appLogger.info(`Profile updated for user ${user.fullName}`);
  return sendSuccessResponse(res, { ...user, ...req.body });
});

module.exports = {
  updateProfile,
  getUsers,
};
