/* eslint-disable no-underscore-dangle */
const catchAsync = require('../../helpers/error/catchAsyncError');
const AuthServices = require('../../services/auth.service');

const { appLogger } = require('../../helpers/logger/appLogger');
const {
  sendErrorResponse,
  sendSuccessResponse,
  HTTP_NOT_FOUND,
} = require('../../utils/httpResponse');

const updateProfile = catchAsync(async (req, res) => {
  const user = await AuthServices.getUser(req.params.userId);
  if (!user) return sendErrorResponse(res, HTTP_NOT_FOUND, 'User Not Found!');

  await AuthServices.updateUser(user._id, req.body);

  appLogger.info(`Profile updated for user ${user.fullName}`);
  return sendSuccessResponse(res, { ...user, ...req.body });
});

module.exports = {
  updateProfile,
};
