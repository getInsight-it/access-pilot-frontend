import React, { Suspense } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { SystemDetail } from "./features/client/pages/client-detail/SystemDetail.tsx";
import { CreateItem } from "./features/level/pages/item/CreateItem.tsx";
import { EditItem } from "./features/level/pages/item/EditItem.tsx";
import { RoleGuard } from "./common/context/auth/RoleGuard.tsx";
import { UserRoleEnum } from "./common/types/user/user.model.ts";
import { LevelList } from "./features/level/pages/level/LevelList.tsx";
import { AUTH_ROUTES, ERROR_ROUTES, PRIVATE_ROUTES } from "./common/constants/routes.ts";

import ErrorLayout from "./layouts/ErrorLayout.tsx";
import Error from "./features/error/Error.tsx";
import RequestList from "./features/requests/pages/RequestList.tsx";
import RequestAccess from "./features/requests/pages/request-access/RequestAccess.tsx";
import ManageRoles from "./features/role/pages/ManageRoles.tsx";
import SystemList from "./features/client/pages/SystemList.tsx";
import SystemForm from "./features/client/pages/SystemForm.tsx";
import Login from "./features/auth/pages/Login.tsx";
import Dashboard from "./features/summary/pages/Dashboard.tsx";
import AuthLayout from "./layouts/AuthLayout.tsx";
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import NewRole from "./features/role/pages/NewRole.tsx";
import LevelItems from "./features/level/pages/item/LevelItems.tsx";
import CreateOrEditLevel from "./features/level/pages/level/CreateLevel.tsx";
import RequestDetailPage from "./features/requests/pages/request-detail/RequestDetailPage.tsx";

import useAuthStore from "./store/authStore.ts";

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
        element: (
          <Suspense>
            <DashboardLayout />
          </Suspense>
        ),
        children: [
          { path: PRIVATE_ROUTES.MY_ACCESS_REQUESTS, element: <RequestList /> },
          { path: PRIVATE_ROUTES.REQUEST_ACCESS, element: <RequestAccess /> },
          {
            path: PRIVATE_ROUTES.ACCESS_REQUESTS_WITH_ID,
            element: <RequestDetailPage />
          },
          {
            path: PRIVATE_ROUTES.DASHBOARD,
            element: (
              <RoleGuard roles={[UserRoleEnum.ADMIN, UserRoleEnum.APPROVER]}>
                <Dashboard />
              </RoleGuard>
            ),
            index: true
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

export const AppRouter: React.FC = () => {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

  const routes = isAuthenticated
    ? [
      ...appRoutes,
      ...errorRoutes,
      { path: "*", element: <Navigate to={ERROR_ROUTES.NOT_FOUND} replace /> }
    ]
    : [
      ...authRoutes,
      ...errorRoutes,
      { path: "/", element: <Navigate to={AUTH_ROUTES.LOGIN} replace /> },
      { path: "*", element: <Navigate to={ERROR_ROUTES.NOT_FOUND} replace /> }
    ];

  return <>{useRoutes(routes)}</>;
};
