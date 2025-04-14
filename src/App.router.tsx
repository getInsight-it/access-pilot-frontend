import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import Login from './features/Login/Login.tsx';
import Dashboard from './features/Dashboard/Dashboard.tsx';
import MyAccessRequests from './features/requests/my-access-request/MyAccessRequests.tsx';
import AuthLayout from './layouts/AuthLayout.tsx';
import DashboardLayout from './layouts/DashboardLayout.tsx';
import { AUTH_ROUTES, ERROR_ROUTES, PRIVATE_ROUTES } from './constants/routes.ts';
import ErrorLayout from './layouts/ErrorLayout.tsx';
import Error from './features/Error/Error.tsx';
import { Suspense } from 'react';
import ManageRequests from './features/requests/manage-request/ManageRequests.tsx';
import RequestAccess from './features/requests/request-access/pages/RequestAccess.tsx';
import Help from './features/Dashboard/help/Help.tsx';
import RolesPage from './features/Dashboard/roles/RolesPage.tsx';
import SystemsPage from './features/Dashboard/systems/SystemsPage.tsx';
import NewSystem from './features/Dashboard/systems/NewSystem.tsx';
import PrivateRoute from './components/PrivateRoute';
import NotificationsPage from './features/Dashboard/notifications/NotificationsPage.tsx';
import useAuthStore from './store/authStore.ts';
import RequestDetailPage from "./features/Dashboard/request-detail/request-detail-page.tsx";
import {SystemEdit} from "./features/Dashboard/systems/SystemEdit.tsx";
import {SystemDetail} from "./features/Dashboard/systems/SystemDetail.tsx";
import {RoleEdit} from "./features/Dashboard/roles/RoleEdit.tsx";
import {RoleDetail} from "./features/Dashboard/roles/RoleDetail.tsx";
import NewRole from "./features/Dashboard/roles/NewRole.tsx";
import Profile from './features/Dashboard/profile/Profile.tsx';
import { CreateItem } from './features/Dashboard/levels/CreateItem.tsx';
import { EditItem } from './features/Dashboard/levels/EditItem.tsx';
import LevelsPage from './features/Dashboard/levels/LevelsPage.tsx';
import LevelItems from './features/Dashboard/levels/LevelItems.tsx';
import CreateOrEditLevel from './features/Dashboard/levels/CreateLevel.tsx';

const authRoutes = [{
  element: <AuthLayout />,
  children: [{
    path: AUTH_ROUTES.LOGIN,
    element: <Login/>
  }]
}];

const privateChildrenCommonRoutes = [
  {
    path: PRIVATE_ROUTES.MY_ACCESS_REQUESTS,
    element: <MyAccessRequests />
  },
  {
    path: PRIVATE_ROUTES.REQUEST_ACCESS,
    element: <RequestAccess />
  },
  {
    path: PRIVATE_ROUTES.ACCESS_REQUESTS_WITH_ID,
    element: <RequestDetailPage />
  },
  {
    path: PRIVATE_ROUTES.HELP,
    element: <Help />,
  },
  {
    path: PRIVATE_ROUTES.NOTIFICATIONS,
    element: <NotificationsPage />
  }
]

const privateCommonRoutes = [
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
          ...privateChildrenCommonRoutes,
          {
            path: '*',
            element: <Navigate to={ PRIVATE_ROUTES.MY_ACCESS_REQUESTS } replace/>
          }
        ]
      }
    ]
  }
];

const privateApproverRoutes = [
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
          ...privateChildrenCommonRoutes,
          {
            path: PRIVATE_ROUTES.DASHBOARD,
            element: <Dashboard />,
            index: true
          },
          {
            path: PRIVATE_ROUTES.SYSTEMS,
            element: <SystemsPage />
          },
          {
            path: PRIVATE_ROUTES.SYSTEMS_EDIT,
            element: <SystemEdit />
          },
          {
            path: PRIVATE_ROUTES.SYSTEMS_DETAILS,
            element: <SystemDetail />
          },
          {
            path: PRIVATE_ROUTES.NEW_SYSTEM,
            element: <NewSystem />
          },
          {
            path: PRIVATE_ROUTES.PROFILE,
            element: <Profile />
          },
          {
            path: PRIVATE_ROUTES.ROLES,
            element: <RolesPage />
          },
          {
            path: PRIVATE_ROUTES.ROLES_EDIT,
            element: <RoleEdit />
          },
          {
            path: PRIVATE_ROUTES.ROLES_DETAILS,
            element: <RoleDetail />
          },
          {
            path: PRIVATE_ROUTES.NEW_ROLE,
            element: <NewRole />
          },
          {
            path: PRIVATE_ROUTES.ACCESS_REQUESTS,
            element: <ManageRequests />
          },
          {
            path: PRIVATE_ROUTES.CREATE_LEVEL,
            element: <CreateOrEditLevel />
          },
          {
            path: PRIVATE_ROUTES.LEVELS,
            element: <LevelsPage />
          },
          {
            path: PRIVATE_ROUTES.LEVEL_ITEMS,
            element: <LevelItems />
          },
          {
            path: PRIVATE_ROUTES.CREATE_ITEM,
            element: <CreateItem />
          },
          {
            path: PRIVATE_ROUTES.EDIT_ITEM,
            element: <EditItem />
          },
          {
            path: PRIVATE_ROUTES.ACCESS_REQUESTS_WITH_ID,
            element: <RequestDetailPage />
          },
          {
            path: '*',
            element: <Navigate to={ PRIVATE_ROUTES.DASHBOARD } replace/>
          }
        ]
      }
    ]
  }
];

const errorRoutes = [{
  element: <ErrorLayout/>,
  children: [{
    path: ERROR_ROUTES.ERROR,
    element: <Error/>
  }, {
    path: ERROR_ROUTES.ERROR_WITH_CODE,
    element: <Error/>
  }],
}];

const routes = [
  ...authRoutes,
  ...errorRoutes,
  {
    path: '/',
    element: <Navigate to={ AUTH_ROUTES.LOGIN } replace/>
  },
  {
    path: '*',
    element: <Navigate to={ ERROR_ROUTES.NOT_FOUND } replace/>
  }
];


export const AppRouter = () => {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const user = useAuthStore((state: any) => state.user);
  const roles = useAuthStore((state: any) => state.roles);

  let currentRoute = routes;

  if (isAuthenticated) {
    currentRoute = privateCommonRoutes;

    if (user?.isApprover) {
      currentRoute = privateApproverRoutes
    }
  }

  return useRoutes(currentRoute);

};
