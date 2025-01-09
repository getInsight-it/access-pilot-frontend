export const PUBLIC_ROUTES = {};

export const AUTH_ROUTES = {
  LOGIN: '/login'
};

export const PRIVATE_ROUTES = {
  DASHBOARD: '/dashboard',
  MY_ACCESS_REQUESTS: '/dashboard/my-access-requests',
  ACCESS_REQUESTS: '/dashboard/access-requests',
  ACCESS_REQUESTS_WITH_ID: '/dashboard/access-requests/:id',
  REQUEST_ACCESS: '/dashboard/request-access',
  HELP: '/dashboard/help',
  ERROR: '/dashboard/error',
  SYSTEMS: '/dashboard/systems',
  SYSTEMS_EDIT: '/dashboard/systems/:clientId/edit',
  SYSTEMS_DETAILS: '/dashboard/systems/:clientId/details',
  NEW_SYSTEM: '/dashboard/system-new',
  ROLES: '/dashboard/systems/:clientId/roles',
  ROLES_EDIT: '/dashboard/roles/:id/edit',
  ROLES_DETAILS: '/dashboard/roles/:id/details',
  NEW_ROLE: '/dashboard/systems/:clientId/role-new',
  NOTIFICATIONS: '/dashboard/notifications',
  PROFILE: '/dashboard/profile'
};

export const ERROR_ROUTES = {
  ERROR: '/error',
  ERROR_WITH_CODE: '/error/:errorCode',
  NOT_FOUND: '/error/404',
  FORBIDDEN: '/error/403'
};
