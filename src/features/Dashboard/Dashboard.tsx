import useAuthStore from '../../store/authStore.ts';
import { authService } from '../../services/auth';
import { FeatureGrid } from '../../components/grid/FeatureGrid';
import GridList from '../../components/GridList';
import GridListNoAccess from '../../components/GridListNoAccess';
import { Stripe } from '../../components/stripe/Stripe';
import { ScrollArea } from '../../components/ui/scroll-area';
import FooterGovbr from '../../components/layout/footer-govbr.tsx';
import { roleService } from '../../services/role';
import { useEffect } from 'react';
import { useTheme } from '../../components/layout/ThemeToggle/theme-provider.tsx';


export default function Dashboard() {

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

  const { theme } = useTheme();

  const getRoles = () => {
    roleService.getRoles();
  };

  const signOut = async () => {
    await authService.signOut();
  };

  useEffect(() => {
    if (isAuthenticated) {
      getRoles();
    }
  }, [isAuthenticated]);

  return (
    <ScrollArea className="h-full">

      <div className="absolute bottom-0 right-0 bg-red-500 z-50 text-white p-6">
        <p className="">[Dashboard] Está autenticado? { isAuthenticated ? 'Sim' : 'Não' }</p>
        <button type="button" onClick={ signOut }>Sair</button>
      </div>
      {/* admin dashboard */}
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 mt-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Olá, bem-vindo de volta
          </h2>
        </div>
        <FeatureGrid />
      </div>

      {/* user dashboard */}
      <div className="hidden flex-1 space-y-4 p-4 pt-6 md:p-8 mt-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Olá, bem-vindo de volta
          </h2>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-[4fr_2fr] gap-10">
          <GridList />
          <div></div>
          <GridListNoAccess />
        </div>
      </div>

      {theme === 'gov' && (
        <div className="mt-20">
          <FooterGovbr />
        </div>
      )}

      {/* <Stripe /> */}
    </ScrollArea>
  );
}
