const JWT = require('jsonwebtoken');
const { accessTokenSecret, refreshTokenSecret } = require('../../../config');

const catchAsync = require('../../../helpers/error/catchAsyncError');

const { appLogger } = require('../../../helpers/logger/appLogger');
const { sendErrorResponse, HTTP_UNAUTHORIZED_ACCESS } = require('../../../utils/httpResponse');

const authUser = catchAsync(async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) return sendErrorResponse(res, HTTP_UNAUTHORIZED_ACCESS, 'Sign in first!');

  const verifiedUser = await JWT.verify(accessToken, accessTokenSecret);
  if (!verifiedUser) return sendErrorResponse(res, HTTP_UNAUTHORIZED_ACCESS, 'Unauthorized Access.');

  req.userId = verifiedUser.id;
  req.email = verifiedUser.email;
  appLogger.info(`Authentication successful for user with id ${verifiedUser.id}`);

  return next();
});

const authRefresher = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) return sendErrorResponse(res, HTTP_UNAUTHORIZED_ACCESS, 'Empty refresh token!');

  const verifiedUser = await JWT.verify(refreshToken, refreshTokenSecret);
  if (!verifiedUser) return sendErrorResponse(res, HTTP_UNAUTHORIZED_ACCESS, 'Invalid Refresh Token!');

  req.body.refreshToken = refreshToken;
  appLogger.info(`Authentication successful for user with id ${verifiedUser.id}`);

  return next();
});

module.exports = authUser;
module.exports = authRefresher;
