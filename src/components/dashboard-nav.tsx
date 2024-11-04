import { Link, useLocation } from 'react-router-dom';
import { Icons } from '../components/icons';
import { cn } from '../lib/utils';
import { NavItem } from '../types';
import { Dispatch, SetStateAction } from 'react';
import { useSidebar } from '../hooks/useSidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip';
import { useTheme } from './layout/ThemeToggle/theme-provider';
import useAuthStore from '../store/authStore';
import { authService } from '../services/auth';

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNav({
  items,
  setOpen,
  isMobileNav = false
}: DashboardNavProps) {
  const location = useLocation();
  const path = location.pathname;
  const { isMinimized } = useSidebar();

  if (!items?.length) {
    return null;
  }

  const { theme } = useTheme();

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

  const signOut = async () => {
    await authService.signOut();
  };

  return (
    <nav className="grid items-start gap-0">
      <TooltipProvider>
        {items.map((item, index) => {
          const Icon = Icons[item.icon || 'arrowRight'];
          return (
            item.href && (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                <Link
                  to={item.disabled ? '/' : item.href}
                  className={cn(
                    'flex items-center gap-2 overflow-hidden py-4 text-sm text-[var(--dashboard-nav-text)] font-medium hover:bg-[var(--dashboard-nav-bg)]',
                    path === item.href ? 'bg-[var(--dashboard-nav-bg)]' : 'transparent',
                    item.disabled && 'cursor-not-allowed opacity-80',
                    isMinimized && 'px-3' // Condiciona a classe px-3 quando não estiver minimizado
                  )}
                  onClick={() => {
                    if (setOpen) setOpen(false);
                  }}
                >
                  
                  <Icon
                    className={cn(
                      isMinimized ? 'ml-3' : 'ml-5',
                      'size-5 text-[var(--dashboard-nav-text)]'
                    )}
                  />
                  
                  {theme === 'gov' && (
                    <hr className="absolute left-0 mt-[52px] h-[1px] w-full bg-gray-100" />
                  )}

                  {isMobileNav || (!isMinimized && !isMobileNav) ? (
                    <span className="mr-2 truncate">{item.title}</span>
                  ) : (
                    ''
                  )}
                </Link>
                </TooltipTrigger>
                <TooltipContent
                  align="center"
                  side="right"
                  sideOffset={8}
                  className={!isMinimized ? 'hidden' : 'inline-block'}
                >
                  {item.title}
                </TooltipContent>
              </Tooltip>
            )
          );
        })}
      </TooltipProvider>
      
      <div className="absolute bottom-32 w-full bg-black z-50 text-white p-6">
        <p className="">Está autenticado? <strong>{ isAuthenticated ? 'Sim' : 'Não' }</strong></p>
        <button type="button" onClick={ signOut }>Sair</button>
      </div>

      {isMobileNav || (!isMinimized && !isMobileNav) ? (
        <div className="absolute bottom-0 p-4 pointer-events-none truncate">
          <p className="text-xs font-regular">Powered by:</p>
          <img className="w-36" src="/accesspilot-logo.svg" />
        </div>
      ) : (
        ''
      )}
    </nav>
  );
}
