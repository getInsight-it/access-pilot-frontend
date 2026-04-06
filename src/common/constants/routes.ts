export const AUTH_ROUTES = {
  LOGIN: '/login'
};

export const PUBLIC_ROUTES = {
  INVITATION: '/invitation'
};

export const PRIVATE_ROUTES = {
  DASHBOARD: '/dashboard/general-info',
  MY_ACCESS_REQUESTS: '/my-access-requests',
  ACCESS_REQUESTS: '/access-requests',
  ACCESS_REQUESTS_WITH_ID: '/access-requests/:id',
  REQUEST_ACCESS: '/request-access',
  MANAGE_INVITES: '/manage-invites',
  MY_INVITES: '/my-invites',
  MY_INVITE_REQUEST: '/my-invites/request',
  MY_INVITE_REQUEST_WITH_ID: '/my-invites/:id/request',
  INVITE: '/invite',
  ERROR: '/error',
  SYSTEMS: '/systems',
  SYSTEMS_EDIT: '/systems/:clientId/edit',
  SYSTEMS_DETAILS: '/systems/:clientId/details',
  NEW_SYSTEM: '/system-new',
  ROLES: '/systems/:clientId/roles',
  ROLES_EDIT: '/systems/:clientId/roles/:id/edit',
  ROLES_DETAILS: '/roles/:id/details',
  NEW_ROLE: '/systems/:clientId/role-new',
  NOTIFICATIONS: '/notifications',
  PROFILE: '/profile',
  CREATE_LEVEL: '/levels/create',
  LEVELS: '/levels',
  LEVEL_ITEMS: '/levels/:id/items',
  CREATE_ITEM: '/levels/:id/items/create',
  EDIT_ITEM: '/levels/:id/items/:itemId/edit',
  HELP_AND_SUPPORT: '/help-and-support',
};

export const ERROR_ROUTES = {
  ERROR: '/error',
  ERROR_WITH_CODE: '/error/:errorCode',
  NOT_FOUND: '/error/404',
  FORBIDDEN: '/error/403'
};
