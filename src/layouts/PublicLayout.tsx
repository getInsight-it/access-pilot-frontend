import { Outlet } from 'react-router-dom';

const PublicLayout = () => {

  return (
    <>
      <p>Sou o PublicLayout</p>
      <Outlet/>
    </>
  )
};

export default PublicLayout;
