import { authService } from '../../services/auth';
import useAuthStore from '../../store/authStore.ts';

const Login = () => {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

  const signIn = async () => {
    await authService.signIn();
  };

  return (
    <>
      <p>Login</p>
      <p>[Login] Está autenticado? { isAuthenticated ? 'Sim' : 'Não' }</p>
      <button type="button" onClick={ signIn }>Entrar</button>
    </>
  )
};

export default Login;
