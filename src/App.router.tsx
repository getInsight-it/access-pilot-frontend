import { Navigate, useRoutes } from "react-router-dom";
import Login from "./features/auth/pages/Login.tsx";
import Dashboard from "./features/summary/pages/Dashboard.tsx";
import MyAccessRequests from "./features/requests/pages/MyAccessRequests.tsx";
import AuthLayout from "./layouts/AuthLayout.tsx";
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import { AUTH_ROUTES, ERROR_ROUTES, PRIVATE_ROUTES } from "./common/constants/routes.ts";
import ErrorLayout from "./layouts/ErrorLayout.tsx";
import Error from "./features/error/Error.tsx";
import React, { Suspense } from "react";
import ManageRequests from "./features/requests/pages/ManageRequests.tsx";
import RequestAccess from "./features/requests/pages/request-access/RequestAccess.tsx";
import RolesPage from "./features/role/pages/RolesPage.tsx";
import SystemsPage from "./features/client/pages/SystemsPage.tsx";
import NewSystem from "./features/client/pages/NewSystem.tsx";
import PrivateRoute from "./components/PrivateRoute";
import NotificationsPage from "./features/notification/NotificationsPage.tsx";
import useAuthStore from "./store/authStore.ts";
import NewRole from "./features/role/pages/NewRole.tsx";
import LevelsPage from "./features/level/pages/level/LevelsPage.tsx";
import LevelItems from "./features/level/pages/level/LevelItems.tsx";
import CreateOrEditLevel from "./features/level/pages/level/CreateLevel.tsx";
import { SystemEdit } from "./features/client/pages/SystemEdit.tsx";
import { SystemDetail } from "./features/client/pages/client-detail/SystemDetail.tsx";
import { RoleEdit } from "./features/role/pages/RoleEdit.tsx";
import { RoleDetail } from "./features/role/pages/RoleDetail.tsx";
import { CreateItem } from "./features/level/pages/item/CreateItem.tsx";
import { EditItem } from "./features/level/pages/item/EditItem.tsx";
import { RoleGuard } from "./common/context/auth/RoleGuard.tsx";
import RequestDetailPage from "./features/requests/pages/request-detail/RequestDetailPage.tsx";
import { UserRoleEnum } from "./common/types/user/user.model.ts";

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
          { path: PRIVATE_ROUTES.MY_ACCESS_REQUESTS, element: <MyAccessRequests /> },
          { path: PRIVATE_ROUTES.REQUEST_ACCESS, element: <RequestAccess /> },
          {
            path: PRIVATE_ROUTES.ACCESS_REQUESTS_WITH_ID,
            element: <RequestDetailPage />
          },
          {
            path: PRIVATE_ROUTES.NOTIFICATIONS,
            element: <NotificationsPage />
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
                <SystemsPage />
              </RoleGuard>
            )
          },
          {
            path: PRIVATE_ROUTES.SYSTEMS_EDIT,
            element: (
              <RoleGuard roles={[UserRoleEnum.ADMIN]}>
                <SystemEdit />
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
                <NewSystem />
              </RoleGuard>
            )
          },
          {
            path: PRIVATE_ROUTES.ROLES,
            element: (
              <RoleGuard roles={[UserRoleEnum.ADMIN]}>
                <RolesPage />
              </RoleGuard>
            )
          },
          {
            path: PRIVATE_ROUTES.ROLES_EDIT,
            element: (
              <RoleGuard roles={[UserRoleEnum.ADMIN]}>
                <RoleEdit />
              </RoleGuard>
            )
          },
          {
            path: PRIVATE_ROUTES.ROLES_DETAILS,
            element: (
              <RoleGuard roles={[UserRoleEnum.ADMIN]}>
                <RoleDetail />
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
                <ManageRequests />
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
                <LevelsPage />
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
