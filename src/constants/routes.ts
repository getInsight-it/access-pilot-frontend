export const PUBLIC_ROUTES = {};

export const AUTH_ROUTES = {
  LOGIN: '/login'
};

export const PRIVATE_ROUTES = {
  DASHBOARD: '/dashboard'
};

export const ERROR_ROUTES = {
  ERROR: '/error',
  ERROR_WITH_CODE: '/error/:errorCode',
  NOT_FOUND: '/error/404',
  FORBIDDEN: '/error/403'
};
