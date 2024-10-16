import { Outlet } from 'react-router-dom';

const AuthLayout = () => {

  return (
    <>
      {/* <p className="bg-red-500 text-white p-4 absolute z-10">Sou o AuthLayout</p> */}
      <Outlet/>
    </>
  )
};

export default AuthLayout;
