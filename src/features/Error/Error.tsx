import { useParams } from 'react-router-dom';

const Error = () => {

  const { errorCode } = useParams();

  return (
    <>
      <p>Error</p>
      <p>{ errorCode ? errorCode : 'Erro genérico' }</p>
    </>
  )
};

export default Error;
