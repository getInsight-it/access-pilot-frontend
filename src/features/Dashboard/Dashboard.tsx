import useAuthStore from '../../store/authStore.ts';
import { authService } from '../../services/auth';
import { FeatureGrid } from '../../components/grid/FeatureGrid';
import GridList from '../../components/GridList';
import GridListNoAccess from '../../components/GridListNoAccess';
import { Stripe } from '../../components/stripe/Stripe';
import { from, interval, startWith, switchMap } from 'rxjs';
import { ScrollArea } from '../../components/ui/scroll-area';
import FooterGovbr from '../../components/layout/footer-govbr.tsx';
import {useEffect, useState} from 'react';
import { useTheme } from '../../components/layout/ThemeToggle/theme-provider.tsx';
import { Typewriter } from '../../typewriter/Typewriter.tsx';
import {SummaryDto} from "../../services/summary/summary-dto.ts";
import {summaryService} from "../../services/summary";
import { motion } from 'framer-motion';

export default function Dashboard() {

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const { theme } = useTheme();
  const [summary, setSummary] = useState<SummaryDto>(null);

  const signOut = async () => {
    await authService.signOut();
  };

  const init = () => {
    getData();
  };

  useEffect(() => {
    if (isAuthenticated) {
      init()
    }
  }, [isAuthenticated]);

  const getData = async () => {
    const polling$ = interval(window.env.DASHBOARD_REFRESH_INTERVAL || 5000).pipe(
      startWith(0),
      switchMap(() => from(summaryService.getSummary()))
    );

    const subscription = polling$.subscribe({
      next: (summaries) => setSummary(summaries),
      error: (err) => console.error(err),
    });

    return () => subscription.unsubscribe();
  };

  

  return (
    <ScrollArea className="h-full">

      {/* <div className="absolute bottom-0 right-0 bg-red-500 z-50 text-white p-6">
        <p className="">[Dashboard] Está autenticado? { isAuthenticated ? 'Sim' : 'Não' }</p>
        <button type="button" onClick={ signOut }>Sair</button>
      </div> */}

      {/* admin dashboard */}
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1,
          transition: { duration: 0.3, delay: 0.3, ease: "easeOut" }
        }}
        className="flex-1 space-y-4 p-4 pt-6 md:p-8"
      >
        <div className="flex items-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Olá, bem-vindo de volta
          </h2>
          {summary && (<Typewriter {...summary}/>)}
        </div>
        <FeatureGrid summary={summary} />
      </motion.div>

      {/* user dashboard */}
      <div className="hidden flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Olá, bem-vindo de volta
          </h2>
        </div>
        
        {/* <div className="grid grid-cols-1 xl:grid-cols-[4fr_2fr] gap-10">
          <GridList />
          <div></div>
          <GridListNoAccess />
        </div> */}

        <div className="">
          <GridList />
          <div></div>
          <GridListNoAccess />
        </div>

      </div>

      {/* {theme === 'gov' && (
        <div className="mt-20">
          <FooterGovbr />
        </div>
      )} */}

      <div className="mt-20">
        {
          summary && (<Stripe summary={summary} />)
        }
      </div>

    </ScrollArea>
  );
}
