import { Outlet } from "react-router-dom";
import Header from "../common/components/layout/header/Header.tsx";

export default function HeaderLayout() {
  return (
    <>
      <Header />
      <div style={{ height: 'calc(var(--mobile-vh, 1vh) * 100 - 64px)' }}>
        <main>
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
