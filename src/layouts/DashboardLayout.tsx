import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {

  return (
    <>
      <p>Sou o DashboardLayout</p>
      <Outlet/>
    </>
  )
};

export default DashboardLayout;
