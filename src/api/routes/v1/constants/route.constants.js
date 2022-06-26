const AUTH_ROUTES = {
  SIGNUP: '/signup',
  SIGNIN: '/signin',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY: '/verify',
  AUTH: '/auth',
  RENEW_PASSWORD: '/renew-password',
};

const withParam = (path, paramName) => (path === '/' ? `:${paramName}` : `${path}/:${paramName}`);

module.exports = {
  AUTH_ROUTES,
  withParam,
};
