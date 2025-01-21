import { Outlet } from 'react-router-dom';
import Header from '../components/layout/header';
import Sidebar from '../components/layout/sidebar';

export default function DashboardLayout() {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden overflow-y-auto pt-16">
          <Outlet/>
        </main>
      </div>
    </>
  );
}