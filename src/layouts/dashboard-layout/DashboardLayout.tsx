import { Outlet } from "react-router-dom";
import Header from "../../common/components/layout/header/Header.tsx";
import Sidebar from "../../common/components/layout/sidebar/Sidebar.tsx";

export default function DashboardLayout() {
  return (
    <>
      <Header />
      <div style={{ height: 'calc(var(--mobile-vh, 1vh) * 100 - 64px)' }}>
        <Sidebar />
        <main>
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
