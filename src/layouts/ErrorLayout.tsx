import { Outlet } from 'react-router-dom';

const ErrorLayout = () => {

  return (
    <>
      <p>Sou o ErrorLayout</p>
      <Outlet/>
    </>
  )
};

export default ErrorLayout;
