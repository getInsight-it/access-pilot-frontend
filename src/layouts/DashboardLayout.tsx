import { Outlet } from "react-router-dom";
import Header from "../components/layout/header";
import Sidebar from "../components/navigation/sidebar.tsx";

export default function DashboardLayout() {
  return (
    <>
      <Header />
      <div className="flex overflow-hidden h-[calc(100vh-64px)]">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <div className="flex-1 min-h-0">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
