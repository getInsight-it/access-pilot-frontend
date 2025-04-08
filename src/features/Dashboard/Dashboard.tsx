import useAuthStore from '../../store/authStore.ts';
import { authService } from '../../services/auth';
import { FeatureGrid } from '../../components/grid/FeatureGrid';
import GridList from '../../components/GridList';
import GridListNoAccess from '../../components/GridListNoAccess';
import { Stripe } from '../../components/stripe/Stripe';
import { from, interval, startWith, switchMap, combineLatest } from 'rxjs';
import { ScrollArea } from '../../components/ui/scroll-area';
import FooterGovbr from '../../components/layout/footer-govbr.tsx';
import {useEffect, useState} from 'react';
import { useTheme } from '../../components/layout/ThemeToggle/theme-provider.tsx';
import { Typewriter } from '../../typewriter/Typewriter.tsx';
import {SummaryDto} from "../../services/summary/summary-dto.ts";
import {summaryService} from "../../services/summary";
import { motion } from 'framer-motion';

import { Card } from '../../components/utils/Card.tsx';
import {requestService} from "../../services/request";
import {RequestDTO} from "../../services/request/request-d-t-o.ts";

export default function Dashboard() {

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const { theme } = useTheme();
  const [summary, setSummary] = useState<SummaryDto>(null);
  const [requests, setRequests] = useState<RequestDTO[]>(null);

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
      switchMap(() =>
        combineLatest([
          from(summaryService.getSummary()),
          from(requestService.getRequestsMePaginated(1, 3, 'id', 'desc', 'assigned')),
        ])
      )
    );

    const subscription = polling$.subscribe({
      next: ([summaries, requestsResponse]) => {
        setSummary(summaries);
        setRequests(requestsResponse?.items || []);
      },
      error: (err) => console.error(err),
    });

    return () => subscription.unsubscribe();
  };

  return (
    <ScrollArea className="h-full">

      {/* user dashboard */}
      <div className=" flex-1 space-y-4 mb-4 px-4 pt-6 md:px-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Olá, bem-vindo de volta
          </h2>
        </div>
      </div>

      <div className="col-span-2 h-fit px-8">
        <Card className="bg-primary-foreground">
          <div className="relative z-20">
            <p className="mb-5 ml-1.5 text-2xl">Sistemas que você tem acesso</p>
            <GridList />
          </div>
        </Card>
      </div>

      <div className="col-span-2 h-fit px-8 pt-3.5">
        <Card className="bg-primary-foreground">
          <div className="relative z-20">
            <p className="mb-5 ml-1.5 text-2xl">Sistemas que você pode solicitar acesso</p>
            <GridListNoAccess />
          </div>
        </Card>
      </div>

      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1,
          transition: { duration: 0.3, delay: 0.3, ease: "easeOut" }
        }}
        className="flex-1 space-y-4 px-4 md:px-8 mt-6"
      >
        <div className="flex items-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Resumo
          </h2>
          {summary && (<Typewriter {...summary}/>)}
        </div>
        {(summary && requests) && <FeatureGrid summary={summary} requests={requests}/>}
      </motion.div>

      {theme === 'gov' && (
        <div className="mt-20">
          <FooterGovbr />
        </div>
      )}

      <div className="mt-20">
        {
          summary && (<Stripe summary={summary} />)
        }
      </div>

    </ScrollArea>
  );
}
