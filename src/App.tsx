// import './App.css'
// import Login from './pages/auth/Login';
// import { Routes, Route } from 'react-router-dom';
// import Dashboard from './pages/dashboard/page';

// function App() {
//   return (
//     <main className="w-screen min-h-screen flex-col items-center justify-between">
//       {/* <Login /> */}
//       <div>
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//         </Routes>
//       </div>
//     </main>
//   );
// }

// export default App


import AppProvider from './providers';
import AppRouter from './routes';

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
