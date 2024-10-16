// import useAuthStore from '../../store/authStore.ts';
// import { authService } from '../../services/auth';

// const Dashboard = () => {
//   /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
//   const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

//   const signOut = async () => {
//     await authService.signOut();
//   };

//   return (
//     <>
//       <p>Dashboard</p>
//       <p>[Dashboard] Está autenticado? { isAuthenticated ? 'Sim' : 'Não' }</p>
//       <button type="button" onClick={ signOut }>Sair</button>
//     </>
//   )
// };

// export default Dashboard;



import useAuthStore from '../../store/authStore.ts';
import { authService } from '../../services/auth';
import { FeatureGrid } from '../../components/grid/FeatureGrid';
import GridList from '../../components/GridList';
import GridListNoAccess from '../../components/GridListNoAccess';
import { Stripe } from '../../components/stripe/Stripe';
import { ScrollArea } from '../../components/ui/scroll-area';


export default function Dashboard() {

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

  console.log(authService)

  const signOut = async () => {
    await authService.signOut();
  };
  

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

      <Stripe />
    </ScrollArea>
  );
}
