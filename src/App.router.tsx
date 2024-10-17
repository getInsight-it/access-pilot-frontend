import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import Login from './features/Login/Login.tsx';
import Dashboard from './features/Dashboard/Dashboard.tsx';
import MyAccessRequests from './features/Dashboard/my-access-requests/MyAccessRequests.tsx';
import AuthLayout from './layouts/AuthLayout.tsx';
import PublicLayout from './layouts/PublicLayout.tsx';
import DashboardLayout from './layouts/DashboardLayout.tsx';
import { AUTH_ROUTES, ERROR_ROUTES, PRIVATE_ROUTES } from './constants/routes.ts';
import ErrorLayout from './layouts/ErrorLayout.tsx';
import Error from './features/Error/Error.tsx';
import { Suspense } from 'react';
import AccessRequests from './features/Dashboard/access-requests/AccessRequests.tsx';
import RequestAccess from './features/Dashboard/request-access/RequestAccess.tsx';
import Help from './features/Dashboard/help/Help.tsx';
import Roles from './features/Dashboard/roles/Roles.tsx';
import Systems from './features/Dashboard/systems/Systems.tsx';

const publicRoutes = [{
  element: <PublicLayout/>,
  children: []
}];

const authRoutes = [{
  element: <AuthLayout />,
  children: [{
    path: AUTH_ROUTES.LOGIN,
    element: <Login/>
  }]
}];

// const privateRoutes = [{
//   element: <DashboardLayout />,
//   children: [{
//     path: PRIVATE_ROUTES.DASHBOARD,
//     element: <Dashboard/>
//   }],
// }];

const privateRoutes = [
  {
    element: (
      <Suspense>
        <DashboardLayout />
      </Suspense>
    ),
    children: [
      {
        path: PRIVATE_ROUTES.DASHBOARD,
        element: <Dashboard />,
        index: true
      },
      {
        path: PRIVATE_ROUTES.MY_ACCESS_REQUESTS,
        element: <MyAccessRequests />
      },
      {
        path: PRIVATE_ROUTES.REQUEST_ACCESS,
        element: <RequestAccess />
      },
      {
        path: PRIVATE_ROUTES.HELP,
        element: <Help />
      },
      // {
      //   path: PRIVATE_ROUTES.ERROR,
      //   element: <Error />
      // },
      {
        path: PRIVATE_ROUTES.SYSTEMS,
        element: <Systems />
      },
      {
        path: PRIVATE_ROUTES.ROLES,
        element: <Roles />
      },
      {
        path: PRIVATE_ROUTES.ACCESS_REQUESTS,
        element: <AccessRequests />
      },
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
  ...publicRoutes,
  ...authRoutes,
  ...privateRoutes,
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
  return useRoutes(routes);
};
