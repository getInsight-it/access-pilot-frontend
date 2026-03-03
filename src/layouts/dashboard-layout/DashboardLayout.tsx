import { Outlet } from "react-router-dom";
import Header from "../../common/components/layout/header/Header.tsx";
import Sidebar from "../../common/components/layout/sidebar/Sidebar.tsx";
import "./DashboardLayout.scss";

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Header />
      <div className="dashboard-layout__content">
        <Sidebar />
        <main className="dashboard-layout__main">
          <div className="dashboard-layout__main-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
