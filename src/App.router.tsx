// import { Navigate, Outlet, useRoutes } from 'react-router-dom';
// import Login from './features/Login/Login.tsx';
// import Dashboard from './features/Dashboard/Dashboard.tsx';
// import MyAccessRequests from './features/Dashboard/my-access-requests/MyAccessRequests.tsx';
// import AuthLayout from './layouts/AuthLayout.tsx';
// import PublicLayout from './layouts/PublicLayout.tsx';
// import DashboardLayout from './layouts/DashboardLayout.tsx';
// import { AUTH_ROUTES, ERROR_ROUTES, PRIVATE_ROUTES } from './constants/routes.ts';
// import ErrorLayout from './layouts/ErrorLayout.tsx';
// import Error from './features/Error/Error.tsx';
// import { Suspense } from 'react';
// import AccessRequests from './features/Dashboard/access-requests/AccessRequests.tsx';
// import RequestAccess from './features/Dashboard/request-access/RequestAccess.tsx';
// import Help from './features/Dashboard/help/Help.tsx';
// import RolesPage from './features/Dashboard/roles/RolesPage.tsx';
// import SystemsPage from './features/Dashboard/systems/SystemsPage.tsx';
// import NewSystem from './features/Dashboard/system-new/NewSystem.tsx';

// const publicRoutes = [{
//   element: <PublicLayout/>,
//   children: []
// }];

// const authRoutes = [{
//   element: <AuthLayout />,
//   children: [{
//     path: AUTH_ROUTES.LOGIN,
//     element: <Login/>
//   }]
// }];

// // const privateRoutes = [{
// //   element: <DashboardLayout />,
// //   children: [{
// //     path: PRIVATE_ROUTES.DASHBOARD,
// //     element: <Dashboard/>
// //   }],
// // }];

// const privateRoutes = [
//   {
//     element: (
//       <Suspense>
//         <DashboardLayout />
//       </Suspense>
//     ),
//     children: [
//       {
//         path: PRIVATE_ROUTES.DASHBOARD,
//         element: <Dashboard />,
//         index: true
//       },
//       {
//         path: PRIVATE_ROUTES.MY_ACCESS_REQUESTS,
//         element: <MyAccessRequests />
//       },
//       {
//         path: PRIVATE_ROUTES.REQUEST_ACCESS,
//         element: <RequestAccess />
//       },
//       {
//         path: PRIVATE_ROUTES.HELP,
//         element: <Help />
//       },
//       // {
//       //   path: PRIVATE_ROUTES.ERROR,
//       //   element: <Error />
//       // },
//       {
//         path: PRIVATE_ROUTES.SYSTEMS,
//         element: <SystemsPage />
//       },
//       {
//         path: PRIVATE_ROUTES.NEW_SYSTEM,
//         element: <NewSystem />
//       },
//       {
//         path: PRIVATE_ROUTES.ROLES,
//         element: <RolesPage />
//       },
//       {
//         path: PRIVATE_ROUTES.ACCESS_REQUESTS,
//         element: <AccessRequests />
//       },
//     ]
//   }
// ];

// const errorRoutes = [{
//   element: <ErrorLayout/>,
//   children: [{
//     path: ERROR_ROUTES.ERROR,
//     element: <Error/>
//   }, {
//     path: ERROR_ROUTES.ERROR_WITH_CODE,
//     element: <Error/>
//   }],
// }];

// const routes = [
//   ...publicRoutes,
//   ...authRoutes,
//   ...privateRoutes,
//   ...errorRoutes,
//   {
//     path: '/',
//     element: <Navigate to={ AUTH_ROUTES.LOGIN } replace/>
//   },
//   {
//     path: '*',
//     element: <Navigate to={ ERROR_ROUTES.NOT_FOUND } replace/>
//   }
// ];

// export const AppRouter = () => {
//   return useRoutes(routes);
// };




// // com guardas
// import { Navigate, Outlet, useRoutes } from 'react-router-dom';
// import Login from './features/Login/Login.tsx';
// import Dashboard from './features/Dashboard/Dashboard.tsx';
// import MyAccessRequests from './features/Dashboard/my-access-requests/MyAccessRequests.tsx';
// import AuthLayout from './layouts/AuthLayout.tsx';
// import PublicLayout from './layouts/PublicLayout.tsx';
// import DashboardLayout from './layouts/DashboardLayout.tsx';
// import { AUTH_ROUTES, ERROR_ROUTES, PRIVATE_ROUTES } from './constants/routes.ts';
// import ErrorLayout from './layouts/ErrorLayout.tsx';
// import Error from './features/Error/Error.tsx';
// import { Suspense } from 'react';
// import AccessRequests from './features/Dashboard/access-requests/AccessRequests.tsx';
// import RequestAccess from './features/Dashboard/request-access/RequestAccess.tsx';
// import Help from './features/Dashboard/help/Help.tsx';
// import RolesPage from './features/Dashboard/roles/RolesPage.tsx';
// import SystemsPage from './features/Dashboard/systems/SystemsPage.tsx';
// import NewSystem from './features/Dashboard/system-new/NewSystem.tsx';
// import PrivateRoute from './components/PrivateRoute';
// import NotificationsPage from './features/Dashboard/notifications/NotificationsPage.tsx';

// const publicRoutes = [{
//   element: <PublicLayout/>,
//   children: []
// }];

// const authRoutes = [{
//   element: <AuthLayout />,
//   children: [{
//     path: AUTH_ROUTES.LOGIN,
//     element: <Login/>
//   }]
// }];

// const privateRoutes = [
//   {
//     element: <PrivateRoute />,
//     children: [
//       {
//         element: (
//           <Suspense>
//             <DashboardLayout />
//           </Suspense>
//         ),
//         children: [
//           {
//             path: PRIVATE_ROUTES.DASHBOARD,
//             element: <Dashboard />,
//             index: true
//           },
//           {
//             path: PRIVATE_ROUTES.MY_ACCESS_REQUESTS,
//             element: <MyAccessRequests />
//           },
//           {
//             path: PRIVATE_ROUTES.REQUEST_ACCESS,
//             element: <RequestAccess />
//           },
//           {
//             path: PRIVATE_ROUTES.HELP,
//             element: <Help />
//           },
//           {
//             path: PRIVATE_ROUTES.SYSTEMS,
//             element: <SystemsPage />
//           },
//           {
//             path: PRIVATE_ROUTES.NEW_SYSTEM,
//             element: <NewSystem />
//           },
//           {
//             path: PRIVATE_ROUTES.ROLES,
//             element: <RolesPage />
//           },
//           {
//             path: PRIVATE_ROUTES.ACCESS_REQUESTS,
//             element: <AccessRequests />
//           },
//           {
//             path: PRIVATE_ROUTES.NOTIFICATIONS,
//             element: <NotificationsPage />
//           },
//         ]
//       }
//     ]
//   }
// ];

// const errorRoutes = [{
//   element: <ErrorLayout/>,
//   children: [{
//     path: ERROR_ROUTES.ERROR,
//     element: <Error/>
//   }, {
//     path: ERROR_ROUTES.ERROR_WITH_CODE,
//     element: <Error/>
//   }],
// }];

// const routes = [
//   ...publicRoutes,
//   ...authRoutes,
//   ...privateRoutes,
//   ...errorRoutes,
//   {
//     path: '/',
//     element: <Navigate to={ AUTH_ROUTES.LOGIN } replace/>
//   },
//   {
//     path: '*',
//     element: <Navigate to={ ERROR_ROUTES.NOT_FOUND } replace/>
//   }
// ];

// export const AppRouter = () => {

//   return useRoutes(routes);

// };



import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import Login from './features/Login/Login.tsx';
import Dashboard from './features/Dashboard/Dashboard.tsx';
import MyAccessRequests from './features/Dashboard/my-access-requests/MyAccessRequests.tsx';
import AuthLayout from './layouts/AuthLayout.tsx';
import DashboardLayout from './layouts/DashboardLayout.tsx';
import { AUTH_ROUTES, ERROR_ROUTES, PRIVATE_ROUTES } from './constants/routes.ts';
import ErrorLayout from './layouts/ErrorLayout.tsx';
import Error from './features/Error/Error.tsx';
import { Suspense } from 'react';
import AccessRequests from './features/Dashboard/access-requests/AccessRequests.tsx';
import RequestAccess from './features/Dashboard/request-access/RequestAccess.tsx';
import Help from './features/Dashboard/help/Help.tsx';
import RolesPage from './features/Dashboard/roles/RolesPage.tsx';
import SystemsPage from './features/Dashboard/systems/SystemsPage.tsx';
import NewSystem from './features/Dashboard/system-new/NewSystem.tsx';
import PrivateRoute from './components/PrivateRoute';
import NotificationsPage from './features/Dashboard/notifications/NotificationsPage.tsx';
import useAuthStore from './store/authStore.ts';

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
            path: PRIVATE_ROUTES.NEW_SYSTEM,
            element: <NewSystem />
          },
          {
            path: PRIVATE_ROUTES.ROLES,
            element: <RolesPage />
          },
          {
            path: PRIVATE_ROUTES.ACCESS_REQUESTS,
            element: <AccessRequests />
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
