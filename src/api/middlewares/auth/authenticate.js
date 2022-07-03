const JWT = require('jsonwebtoken');
const { tokenSecret } = require('../../../config');

const catchAsync = require('../../../helpers/error/catchAsyncError');

const { appLogger } = require('../../../helpers/logger/appLogger');
const { sendErrorResponse, HTTP_UNAUTHORIZED_ACCESS } = require('../../../utils/httpResponse');

const authUser = catchAsync(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) return sendErrorResponse(res, HTTP_UNAUTHORIZED_ACCESS, 'Sign in first!');

  const verifiedUser = await JWT.verify(token, tokenSecret);
  if (!verifiedUser) return sendErrorResponse(res, HTTP_UNAUTHORIZED_ACCESS, 'Unauthorized Access.');

  req.userId = verifiedUser.id;
  req.username = verifiedUser.username;
  appLogger.info(`Authentication successful for user with id ${verifiedUser.id}`);

  return next();
});

module.exports = authUser;
