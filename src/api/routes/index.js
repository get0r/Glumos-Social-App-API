const express = require('express');

const { AUTH_ROUTES } = require('./v1/constants/route.constants');

const authRouter = require('./v1/auth.routes');

const indexRouter = express.Router();
const v1IndexRouter = express.Router();

// version 1 - router all routes
v1IndexRouter.use(AUTH_ROUTES.AUTH, authRouter);
v1IndexRouter.use('/posts', authRouter);

indexRouter.use('/v1', v1IndexRouter);

module.exports = indexRouter;
