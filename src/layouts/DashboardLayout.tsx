import { Outlet } from "react-router-dom";
import Header from "../common/components/layout/header/Header.tsx";
import Sidebar from "../common/components/layout/sidebar/Sidebar.tsx";

export default function DashboardLayout() {
  return (
    <>
      <Header />
      <div className="flex overflow-hidden h-[calc(100vh-64px)]">
        <Sidebar  className="hidden md:flex"/>
        <main className="flex-1 flex flex-col">
          <div className="flex-1 min-h-0">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
