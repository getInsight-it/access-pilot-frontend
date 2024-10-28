import { useParams } from 'react-router-dom';

const Error = () => {

  const { errorCode } = useParams();

  return (
    <>
      <div className="absolute top-0 pl-10 pt-60">
        <p>Error</p>
        <p>{ errorCode ? errorCode : 'Erro genérico' }</p>
      </div>
    </>
  )
};

export default Error;
