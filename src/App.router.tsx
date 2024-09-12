import { Navigate, useRoutes } from 'react-router-dom';
import Login from './features/Login/Login.tsx';
import Dashboard from './features/Dashboard/Dashboard.tsx';
import AuthLayout from './layouts/AuthLayout.tsx';
import PublicLayout from './layouts/PublicLayout.tsx';
import DashboardLayout from './layouts/DashboardLayout.tsx';
import { AUTH_ROUTES, ERROR_ROUTES, PRIVATE_ROUTES } from './constants/routes.ts';
import ErrorLayout from './layouts/ErrorLayout.tsx';
import Error from './features/Error/Error.tsx';

const publicRoutes = [{
  element: <PublicLayout/>,
  children: []
}];

const authRoutes = [{
  element: <AuthLayout/>,
  children: [{
    path: AUTH_ROUTES.LOGIN,
    element: <Login/>
  }]
}];

const privateRoutes = [{
  element: <DashboardLayout/>,
  children: [{
    path: PRIVATE_ROUTES.DASHBOARD,
    element: <Dashboard/>
  }],
}];

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
