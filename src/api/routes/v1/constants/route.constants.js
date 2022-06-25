const AUTH_ROUTES = {
  SIGNUP: '/signup',
  SIGNIN: '/signin',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY: '/verify',
  AUTH: '/auth',
};

const withParam = (path, paramName) => (path === '/' ? `:${paramName}` : `${path}/:${paramName}`);

module.exports = {
  AUTH_ROUTES,
  withParam,
};
