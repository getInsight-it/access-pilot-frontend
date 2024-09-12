import { Button } from '@/components/ui/button';
import { useRouter } from '@/routes/hooks';
import { Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../components/layout/ThemeToggle/theme-provider';

const ErrorFallback = ({ error }: FallbackProps) => {
  const router = useRouter();
  console.log('error', error);
  return (
    <div
      className="flex h-screen w-screen flex-col items-center  justify-center text-red-500"
      role="alert"
    >
      <h2 className="text-2xl font-semibold">
        Ooops, algo deu errado :({' '}
      </h2>
      <pre className="text-2xl font-bold">{error.message}</pre>
      <pre>{error.stack}</pre>
      <Button className="mt-4" onClick={() => router.back()}>
        Voltar
      </Button>
    </div>
  );
};

export default function AppProvider({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <HelmetProvider>
        <BrowserRouter>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <ThemeProvider
            // defaultTheme="dark"
            // storageKey="vite-ui-theme"
            >
              {children}
            </ThemeProvider>
          </ErrorBoundary>
        </BrowserRouter>
      </HelmetProvider>
    </Suspense>
  );
}
