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

const USER_ROUTES = {
  USERS: '/users',
};

const withParam = (path, paramName) => (path === '/' ? `:${paramName}` : `${path}/:${paramName}`);

module.exports = {
  AUTH_ROUTES,
  withParam,
  USER_ROUTES,
};
