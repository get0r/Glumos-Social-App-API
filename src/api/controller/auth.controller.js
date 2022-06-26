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
const { generateOTPDigit } = require('../../utils/utilFunctions');
const { hashString } = require('../../utils/hashGenerator');

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

  return sendSuccessResponse(res, _.omit(user, ['_id', 'password']));
});

const userSignIn = catchAsync(async (req, res) => {
  /* This is the signin function. It takes the user's information from the request body, and then
    passes it to the signin function in the AuthServices. If the user is not found, it returns an
    error. If the user is found, it generates a token,
    and sends the user. */
  const userInfo = req.body;
  const user = await AuthServices.signIn(userInfo);

  if (!user) return sendErrorResponse(res, HTTP_UNAUTHORIZED_ACCESS, 'Email or password incorrect!');

  if (!user.isVerified) return sendErrorResponse(res, HTTP_UNAUTHORIZED_ACCESS, 'Account not verified yet!');

  const token = AuthServices.generateAuthToken(user._id, user.email);
  //  place the token on the cookie and send the user
  res.cookie('token', token, { httpOnly: true, secure: true, sameSite: true });
  appLogger.info(`User SignIn Successful userId ${user._id}`);

  return sendSuccessResponse(res, { ..._.omit(user, ['_id', 'password', '__v']), token });
});

const getUser = catchAsync(async (req, res) => {
  /* This is the getUser function. It takes the userId from the request, and then
    passes it to the getUser function in the AuthServices. If the user is not found, it returns an
    error. If the user is found, it sends the user. */
  const user = await AuthServices.getUser(req.userId);

  if (!user) return sendErrorResponse(res, HTTP_NOT_FOUND, 'Not Found!');

  const { token } = req.cookies;
  return sendSuccessResponse(res, { ..._.omit(user, ['_id', 'password']), token });
});

const verifyUser = catchAsync(async (req, res) => {
  const decodedTokenData = await AuthServices.verifyJWToken(req.params.verificationToken);
  if (!decodedTokenData) return sendErrorResponse(res, HTTP_BAD_REQUEST, 'Invalid token.');

  const user = await AuthServices.verifyUser(
    decodedTokenData.id,
    decodedTokenData.email,
    decodedTokenData.createdAt,
  );
  if (!user) return sendErrorResponse(res, HTTP_NOT_FOUND, 'User Not Found!');

  return sendSuccessResponse(res, _.omit({ ...user, isVerified: true }, ['_id', 'password']));
});

const getForgotPasswordOTP = catchAsync(async (req, res) => {
  const user = await AuthServices.findUserByEmail(req.body.email);
  if (!user) return sendErrorResponse(res, HTTP_NOT_FOUND, 'User Not Found!');
  const otpCode = generateOTPDigit().toString();

  await AuthServices.updateUser(user._id, { forgotPassOTP: otpCode });
  await EmailService.sendOTPEmail(user.email, otpCode);

  return sendSuccessResponse(res, 'A code is sent to your email');
});

const renewPassword = catchAsync(async (req, res) => {
  const user = await AuthServices.findUserByEmail(req.body.email);
  if (!user) return sendErrorResponse(res, HTTP_NOT_FOUND, 'User Not Found!');

  const { code, newPassword } = req.body;
  if (parseInt(code, 10) !== parseInt(user.forgotPassOTP, 10)) return sendErrorResponse(res, HTTP_BAD_REQUEST, 'Incorrect code!');

  const hashedPassword = await hashString(newPassword);
  await AuthServices.updateUser(user._id, { password: hashedPassword });

  return sendSuccessResponse(res, 'Password updated successfully.');
});

module.exports = {
  userSignUp,
  userSignIn,
  getUser,
  verifyUser,
  getForgotPasswordOTP,
  renewPassword,
};
