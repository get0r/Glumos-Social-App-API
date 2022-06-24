/* eslint-disable no-underscore-dangle */
const _ = require('lodash');
const catchAsync = require('../../helpers/error/catchAsyncError');
const AuthServices = require('../../services/auth.service');
const EmailService = require('../../services/third-party/email.service');

const { appLogger } = require('../../helpers/logger/appLogger');

const {
  sendErrorResponse,
  HTTP_BAD_REQUEST,
  sendSuccessResponse,
  HTTP_UNAUTHORIZED_ACCESS,
  HTTP_NOT_FOUND,
} = require('../../utils/httpResponse');

const userSignUp = catchAsync(async (req, res) => {
  /* This is the signup function. It takes the user's information from the request body, and then
  passes it to the signup function in the AuthServices. If the user is not created, it returns an
  error. If the user is created, it generates a verification token,
  and sends an email to the user. */

  const userInfo = req.body;
  const user = await AuthServices.signUp(userInfo);

  if (!user) return sendErrorResponse(res, HTTP_BAD_REQUEST, 'Email already exists');

  const verificationToken = AuthServices
    .generateVerificationToken(user._id, user.email, user.createdAt);

  await EmailService.sendVerificationEmail(user.email, verificationToken);
  //  place the token on the cookie and send the user
  appLogger.info(`User Registration Successful userId ${user._id}`);

  return sendSuccessResponse(res, { ..._.omit(user, ['_id', 'password']) });
});

const userSignIn = catchAsync(async (req, res) => {
  const userInfo = req.body;
  const user = await AuthServices.signIn(userInfo);

  if (!user) return sendErrorResponse(res, HTTP_UNAUTHORIZED_ACCESS, 'Email or password incorrect!');

  if (!user.isVerified) return sendErrorResponse(res, HTTP_UNAUTHORIZED_ACCESS, 'Account not verified yet!');

  const token = AuthServices.generateAuthToken(user._id, user.email);
  //  place the token on the cookie and send the user
  res.cookie('token', token, { httpOnly: true, secure: true, sameSite: true });
  appLogger.info(`User SignIn Successful userId ${user._id}`);

  return sendSuccessResponse(res, { ..._.pick(user, ['_id', 'name', 'email']), token });
});

const getUser = catchAsync(async (req, res) => {
  const user = await AuthServices.getUser(req.userId);

  if (!user) return sendErrorResponse(res, HTTP_NOT_FOUND, 'Not Found!');

  const { token } = req.cookies;
  return sendSuccessResponse(res, { ..._.pick(user, ['_id', 'name', 'email']), token });
});

module.exports = {
  userSignUp,
  userSignIn,
  getUser,
};
