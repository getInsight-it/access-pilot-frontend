import useAuthStore from '../../store/authStore.ts';
import { authService } from '../../services/auth';

const Dashboard = () => {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

  const signOut = async () => {
    await authService.signOut();
  };

  return (
    <>
      <p>Dashboard</p>
      <p>[Dashboard] Está autenticado? { isAuthenticated ? 'Sim' : 'Não' }</p>
      <button type="button" onClick={ signOut }>Sair</button>
    </>
  )
};

export default Dashboard;
