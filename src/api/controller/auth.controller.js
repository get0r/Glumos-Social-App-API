const _ = require('lodash');
const catchAsync = require('../../helpers/error/catchAsyncError');
const AuthServices = require('../../services/auth.service');

const { appLogger } = require('../../helpers/logger/appLogger');

const {
  sendErrorResponse,
  HTTP_BAD_REQUEST,
  sendSuccessResponse,
  HTTP_UNAUTHORIZED_ACCESS,
  HTTP_NOT_FOUND,
} = require('../../utils/httpResponse');

const userSignUp = catchAsync(async (req, res) => {
  const userInfo = req.body;
  const user = await AuthServices.signUp(userInfo);

  if (!user) return sendErrorResponse(res, HTTP_BAD_REQUEST, 'username already exists');

  const token = AuthServices.generateAuthToken(user._id, user.username);

  //  place the token on the cookie and send the user
  res.cookie('token', token, { httpOnly: true, secure: true, sameSite: true });
  appLogger.info(`User Registration Successful userId ${user._id}`);

  return sendSuccessResponse(res, { ..._.pick(user, ['_id', 'name', 'username']), token });
});

const userSignIn = catchAsync(async (req, res) => {
  const userInfo = req.body;
  const user = await AuthServices.signIn(userInfo);

  if (!user) return sendErrorResponse(res, HTTP_UNAUTHORIZED_ACCESS, 'username or password incorrect!');

  const token = AuthServices.generateAuthToken(user._id, user.username);
  //  place the token on the cookie and send the user
  res.cookie('token', token, { httpOnly: true, secure: true, sameSite: true });
  appLogger.info(`User SignIn Successful userId ${user._id}`);

  return sendSuccessResponse(res, { ..._.pick(user, ['_id', 'name', 'username']), token });
});

const getUser = catchAsync(async (req, res) => {
  const user = await AuthServices.getUser(req.userId);

  if (!user) return sendErrorResponse(res, HTTP_NOT_FOUND, 'Not Found!');

  const { token } = req.cookies;
  return sendSuccessResponse(res, { ..._.pick(user, ['_id', 'name', 'username']), token });
});

module.exports = {
  userSignUp,
  userSignIn,
  getUser,
};
