const express = require('express');

const { AUTH_ROUTES, USER_ROUTES } = require('./v1/constants/route.constants');

const authRouter = require('./v1/auth.routes');
const userRouter = require('./v1/user.routes');

const indexRouter = express.Router();
const v1IndexRouter = express.Router();

// version 1 - router all routes
v1IndexRouter.use(AUTH_ROUTES.AUTH, authRouter);
v1IndexRouter.use(USER_ROUTES.USERS, userRouter);

indexRouter.use('/v1', v1IndexRouter);

module.exports = indexRouter;
