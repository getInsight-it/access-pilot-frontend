export const PUBLIC_ROUTES = {};

export const AUTH_ROUTES = {
  LOGIN: '/login'
};

export const PRIVATE_ROUTES = {
  DASHBOARD: '/dashboard',
  MY_ACCESS_REQUESTS: '/dashboard/my-access-requests',
  ACCESS_REQUESTS: '/dashboard/access-requests',
  REQUEST_ACCESS: '/dashboard/request-access',
  HELP: '/dashboard/help',
  ERROR: '/dashboard/error',
  SYSTEMS: '/dashboard/systems',
  ROLES: '/dashboard/roles'
};

export const ERROR_ROUTES = {
  ERROR: '/error',
  ERROR_WITH_CODE: '/error/:errorCode',
  NOT_FOUND: '/error/404',
  FORBIDDEN: '/error/403'
};
