import { Outlet } from "react-router-dom";
import Header from "../common/components/layout/header/Header.tsx";

export default function HeaderLayout() {
  return (
    <>
      <Header />
      <div className="flex overflow-hidden h-[calc(100vh-64px)]">
        <main className="flex-1 flex flex-col w-full">
          <div className="flex-1 min-h-0">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}