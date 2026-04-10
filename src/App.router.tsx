import React, { Suspense } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { SystemDetail } from "./features/client/pages/client-detail/SystemDetail.tsx";
import { CreateItem } from "./features/level/pages/item/CreateItem.tsx";
import { EditItem } from "./features/level/pages/item/EditItem.tsx";
import { RoleGuard } from "./common/context/auth/RoleGuard.tsx";
import { UserRoleEnum } from "./common/types/user/user.model.ts";
import { LevelList } from "./features/level/pages/level/level-list/LevelList.tsx";
import { AUTH_ROUTES, ERROR_ROUTES, PRIVATE_ROUTES, PUBLIC_ROUTES } from "./common/constants/routes.ts";

import ErrorLayout from "./layouts/ErrorLayout.tsx";
import Error from "./features/error/Error.tsx";
import RequestList from "./features/requests/pages/request-list/RequestList.tsx";
import RequestAccess from "./features/requests/pages/request-access/RequestAccess.tsx";
import ManageInvites from "./features/requests/pages/manage-invites/ManageInvites.tsx";
import MyInvites from "./features/requests/pages/my-invites/MyInvites.tsx";
import Invite from "./features/requests/pages/invite/Invite.tsx";
import MyInviteRequest from "./features/requests/pages/my-invite-request/MyInviteRequest.tsx";
import ManageRoles from "./features/role/pages/manage-roles/ManageRoles.tsx";
import SystemList from "./features/client/pages/system-list/SystemList.tsx";
import SystemForm from "./features/client/pages/system-form/SystemForm.tsx";
import Login from "./features/auth/pages/Login.tsx";
import Dashboard from "./features/summary/pages/Dashboard.tsx";
import AuthLayout from "./layouts/AuthLayout.tsx";
import DashboardLayout from "./layouts/dashboard-layout/DashboardLayout.tsx";
import NewRole from "./features/role/pages/new-role/NewRole.tsx";
import LevelItems from "./features/level/pages/item/level-items/LevelItems.tsx";
import CreateOrEditLevel from "./features/level/pages/level/create-level/CreateLevel.tsx";
import RequestDetailPage from "./features/requests/pages/request-detail/RequestDetailPage.tsx";
import Invitation from "./features/invitation/pages/invitation/Invitation.tsx";
import LoaderPreview from "./features/dev/pages/loader-preview/LoaderPreview.tsx";

import useAuthStore from "./store/authStore.ts";
import HeaderLayout from "./layouts/HeaderLayout.tsx";
import HelpAndSupport from "./features/help-and-support/HelpAndSupport.tsx";

const PrivateRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if(!isAuthenticated) {
    return <Navigate to={AUTH_ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

const authRoutes = [
  {
    element: <AuthLayout />,
    children: [
      { path: AUTH_ROUTES.LOGIN, element: <Login /> }
    ]
  }
];

const publicRoutes = [
  {
    element: <AuthLayout />,
    children: [
      { path: PUBLIC_ROUTES.INVITATION, element: <Invitation /> },
      { path: PUBLIC_ROUTES.LOADER_PREVIEW, element: <LoaderPreview /> }
    ]
  }
];

const errorRoutes = [
  {
    element: <ErrorLayout />,
    children: [
      { path: ERROR_ROUTES.ERROR, element: <Error /> },
      { path: ERROR_ROUTES.ERROR_WITH_CODE, element: <Error /> }
    ]
  }
];

const appRoutes = [
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: (
          <Suspense>
            <DashboardLayout />
          </Suspense>
        ),
        children: [
          { index: true, element: <Navigate to={PRIVATE_ROUTES.DASHBOARD} replace /> },
          { path: PRIVATE_ROUTES.MY_ACCESS_REQUESTS, element: <RequestList /> },
          { path: PRIVATE_ROUTES.REQUEST_ACCESS, element: <RequestAccess /> },
          {
            path: PRIVATE_ROUTES.MANAGE_INVITES,
            element: (
              <RoleGuard roles={[UserRoleEnum.INVITE_SENDER]}>
                <ManageInvites />
              </RoleGuard>
            )
          },
          { path: PRIVATE_ROUTES.MY_INVITES, element: <MyInvites /> },
          { path: PRIVATE_ROUTES.MY_INVITE_REQUEST, element: <MyInviteRequest /> },
          { path: PRIVATE_ROUTES.MY_INVITE_REQUEST_WITH_ID, element: <MyInviteRequest /> },
          {
            path: PRIVATE_ROUTES.INVITE,
            element: (
              <RoleGuard roles={[UserRoleEnum.INVITE_SENDER]}>
                <Invite />
              </RoleGuard>
            )
          },
          {
            path: PRIVATE_ROUTES.ACCESS_REQUESTS_WITH_ID,
            element: <RequestDetailPage />
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD,
            element: (
              <RoleGuard>
                <Dashboard />
              </RoleGuard>
            )
          },
          {
            path: PRIVATE_ROUTES.SYSTEMS,
            element: (
              <RoleGuard roles={[UserRoleEnum.ADMIN]}>
                <SystemList />
              </RoleGuard>
            )
          },
          {
            path: PRIVATE_ROUTES.SYSTEMS_EDIT,
            element: (
              <RoleGuard roles={[UserRoleEnum.ADMIN]}>
                <SystemForm />
              </RoleGuard>
            )
          },
          {
            path: PRIVATE_ROUTES.SYSTEMS_DETAILS,
            element: (
              <RoleGuard roles={[UserRoleEnum.ADMIN]}>
                <SystemDetail />
              </RoleGuard>
            )
          },
          {
            path: PRIVATE_ROUTES.NEW_SYSTEM,
            element: (
              <RoleGuard roles={[UserRoleEnum.ADMIN]}>
                <SystemForm />
              </RoleGuard>
            )
          },
          {
            path: PRIVATE_ROUTES.ROLES,
            element: (
              <RoleGuard roles={[UserRoleEnum.ADMIN]}>
                <ManageRoles />
              </RoleGuard>
            )
          },
          {
            path: PRIVATE_ROUTES.ROLES_EDIT,
            element: (
              <RoleGuard roles={[UserRoleEnum.ADMIN]}>
                <NewRole />
              </RoleGuard>
            )
          },
          {
            path: PRIVATE_ROUTES.ROLES_DETAILS,
            element: (
              <RoleGuard roles={[UserRoleEnum.ADMIN]}>
                <NewRole />
              </RoleGuard>
            )
          },
          {
            path: PRIVATE_ROUTES.NEW_ROLE,
            element: (
              <RoleGuard roles={[UserRoleEnum.ADMIN]}>
                <NewRole />
              </RoleGuard>
            )
          },
          {
            path: PRIVATE_ROUTES.ACCESS_REQUESTS,
            element: (
              <RoleGuard roles={[UserRoleEnum.APPROVER]}>
                <RequestList />
              </RoleGuard>
            )
          },
          {
            path: PRIVATE_ROUTES.CREATE_LEVEL,
            element: (
              <RoleGuard roles={[UserRoleEnum.ADMIN]}>
                <CreateOrEditLevel />
              </RoleGuard>
            )
          },
          {
            path: PRIVATE_ROUTES.LEVELS,
            element: (
              <RoleGuard roles={[UserRoleEnum.ADMIN]}>
                <LevelList />
              </RoleGuard>
            )
          },
          {
            path: PRIVATE_ROUTES.LEVEL_ITEMS,
            element: (
              <RoleGuard roles={[UserRoleEnum.ADMIN]}>
                <LevelItems />
              </RoleGuard>
            )
          },
          {
            path: PRIVATE_ROUTES.CREATE_ITEM,
            element: (
              <RoleGuard roles={[UserRoleEnum.ADMIN]}>
                <CreateItem />
              </RoleGuard>
            )
          },
          {
            path: PRIVATE_ROUTES.EDIT_ITEM,
            element: (
              <RoleGuard roles={[UserRoleEnum.ADMIN]}>
                <EditItem />
              </RoleGuard>
            )
          },
          { path: "*", element: <Navigate to={ERROR_ROUTES.NOT_FOUND} replace /> }
        ]
      }
    ]
  }
];

const helpAndSupportRoutes = [
  {
    element: <PrivateRoute />,
    children: [
      {
        element: (
          <Suspense>
            <HeaderLayout />
          </Suspense>
        ),
        children: [
          {
            path: PRIVATE_ROUTES.HELP_AND_SUPPORT,
            element: (
              <HelpAndSupport />
            )
          }
        ]
      }
    ]
  }
];

export const AppRouter: React.FC = () => {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

  const routes = isAuthenticated
    ? [
      ...publicRoutes,
      ...appRoutes,
      ...errorRoutes,
      ...helpAndSupportRoutes,
      { path: "*", element: <Navigate to={ERROR_ROUTES.NOT_FOUND} replace /> }
    ]
    : [
      ...authRoutes,
      ...publicRoutes,
      ...errorRoutes,
      { path: "/", element: <Navigate to={AUTH_ROUTES.LOGIN} replace /> },
      { path: "*", element: <Navigate to={ERROR_ROUTES.NOT_FOUND} replace /> }
    ];

  return <>{useRoutes(routes)}</>;
};
