const AUTH_ROUTES = {
  SIGNUP: '/signup',
  SIGNIN: '/signin',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY: '/verify',
  AUTH: '/auth',
  RENEW_PASSWORD: '/renew-password',
  REFRESH_TOKEN: '/refresh-token',
  SIGNOUT: '/signout',
};

const ROOT_PATH = {
  ROOT: '/',
};

const USER_ROUTES = {
  ROOT: '/',
  USERS: '/users',
};

const POST_ROUTES = {
  POSTS: '/posts',
};

const withParam = (path, paramName) => (path === '/' ? `/:${paramName}` : `${path}/:${paramName}`);

module.exports = {
  AUTH_ROUTES,
  ROOT_PATH,
  POST_ROUTES,
  withParam,
  USER_ROUTES,
};
