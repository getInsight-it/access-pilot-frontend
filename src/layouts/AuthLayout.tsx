import { Outlet } from 'react-router-dom';

const AuthLayout = () => {

  return (
    <>
      <p>Sou o AuthLayout</p>
      <Outlet/>
    </>
  )
};

export default AuthLayout;
