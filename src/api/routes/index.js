const express = require('express');

const authRouter = require('./v1/auth.routes');

const indexRouter = express.Router();
const v1IndexRouter = express.Router();

// version 1 - router all routes
v1IndexRouter.use(authRouter);

indexRouter.use('/v1', v1IndexRouter);

module.exports = indexRouter;
