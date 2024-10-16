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

  return (
    <nav className="grid items-start gap-2">
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
                      'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm text-[var(--dashboard-nav-text)] font-medium hover:bg-[var(--dashboard-nav-bg)]',
                      path === item.href ? 'bg-[var(--dashboard-nav-bg)]' : 'transparent',
                      item.disabled && 'cursor-not-allowed opacity-80'
                    )}
                    onClick={() => {
                      if (setOpen) setOpen(false);
                    }}
                  >
                    <Icon className={`ml-3 size-5 text-[var(--dashboard-nav-text)]`} />
                    
                    {/* <hr className="absolute left-0 mt-[42px] h-[1px] w-full bg-red-500" /> */}
                    
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
