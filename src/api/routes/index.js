const express = require('express');

const { AUTH_ROUTES, USER_ROUTES, POST_ROUTES } = require('./v1/constants/route.constants');

const authRouter = require('./v1/auth.routes');
const userRouter = require('./v1/user.routes');
const postRouter = require('./v1/post.routes');

const indexRouter = express.Router();
const v1IndexRouter = express.Router();

// version 1 - router all routes
v1IndexRouter.use(AUTH_ROUTES.AUTH, authRouter);
v1IndexRouter.use(USER_ROUTES.USERS, userRouter);
v1IndexRouter.use(POST_ROUTES.POSTS, postRouter);

indexRouter.use('/v1', v1IndexRouter);

module.exports = indexRouter;
