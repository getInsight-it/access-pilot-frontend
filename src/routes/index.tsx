// import { Suspense, lazy } from 'react';
// import { Navigate, Outlet, useRoutes } from 'react-router-dom';

// const DashboardLayout = lazy(
//   () => import('@/layouts/DashboardLayout')
// );
// const Login = lazy(() => import('@/pages/auth/Login'));
// const Dashboard = lazy(() => import('@/pages/dashboard/page'));
// const MyAccessRequests = lazy(() => import('@/pages/dashboard/my-access-requests/page'));
// const RequestAccess = lazy(() => import('@/pages/dashboard/request-access/page'));
// const Help = lazy(() => import('@/pages/dashboard/help/page'));
// const Error = lazy(() => import('@/pages/dashboard/error/page'));
// const AccessRequests = lazy(() => import('@/pages/dashboard/access-requests/page'));
// const Systems = lazy(() => import('@/pages/dashboard/system/page'));
// const Roles = lazy(() => import('@/pages/dashboard/roles/page'));

// // ----------------------------------------------------------------------

// export default function AppRouter() {
//   const dashboardRoutes = [
//     {
//       path: '/',
//       element: (
//         <DashboardLayout>
//           <Suspense>
//             <Outlet />
//           </Suspense>
//         </DashboardLayout>
//       ),
//       children: [

//         {
//           element: <Dashboard />,
//           index: true
//         },
//         {
//           path: 'my-access-requests',
//           element: <MyAccessRequests />
//         },
//         {
//           path: 'request-access',
//           element: <RequestAccess />
//         },
//         {
//           path: 'help',
//           element: <Help />
//         },
//         {
//           path: 'error',
//           element: <Error />
//         },
//         {
//           path: 'system',
//           element: <Systems />
//         },
//         {
//           path: 'roles',
//           element: <Roles />
//         },
//         {
//           path: 'access-requests',
//           element: <AccessRequests />
//         },
//       ]
//     }
//   ];

//   const publicRoutes = [
//     {
//       path: '/login',
//       element: <Login />,
//       index: true
//     },
//     {
//       path: '/404',
//       element: <Error />
//     },
//     {
//       path: '*',
//       element: <Navigate to="/404" replace />
//     }
//   ];

//   const routes = useRoutes([...dashboardRoutes, ...publicRoutes]);

//   return routes;
// }


import { Suspense, lazy } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

const DashboardLayout = lazy(() => import('@/layouts/DashboardLayout'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Dashboard = lazy(() => import('@/pages/dashboard/page'));
const MyAccessRequests = lazy(() => import('@/pages/dashboard/my-access-requests/page'));
const RequestAccess = lazy(() => import('@/pages/dashboard/request-access/page'));
const Help = lazy(() => import('@/pages/dashboard/help/page'));
const Error = lazy(() => import('@/pages/dashboard/error/page'));
const AccessRequests = lazy(() => import('@/pages/dashboard/access-requests/page'));
const Systems = lazy(() => import('@/pages/dashboard/system/page'));
const Roles = lazy(() => import('@/pages/dashboard/roles/page'));

// ----------------------------------------------------------------------

export default function AppRouter() {
  const dashboardRoutes = [
    {
      path: '/dashboard',
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          element: <Dashboard />,
          index: true
        },
        {
          path: 'my-access-requests',
          element: <MyAccessRequests />
        },
        {
          path: 'request-access',
          element: <RequestAccess />
        },
        {
          path: 'help',
          element: <Help />
        },
        {
          path: 'error',
          element: <Error />
        },
        {
          path: 'system',
          element: <Systems />
        },
        {
          path: 'roles',
          element: <Roles />
        },
        {
          path: 'access-requests',
          element: <AccessRequests />
        },
      ]
    }
  ];

  const publicRoutes = [
    {
      path: '/login',
      element: <Login />,
      index: true
    },
    {
      path: '/',
      element: <Navigate to="/login" replace />
    },
    {
      path: '/404',
      element: <Error />
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />
    }
  ];

  // Combinação de rotas públicas e dashboard
  const routes = useRoutes([...publicRoutes, ...dashboardRoutes]);

  return routes;
}

