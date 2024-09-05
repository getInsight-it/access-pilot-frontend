'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
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
  const path = usePathname();
  const { isMinimized } = useSidebar();

  if (!items?.length) {
    return null;
  }

  console.log('isActive', isMobileNav, isMinimized);

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
                    href={item.disabled ? '/' : item.href}
                    className={cn(
                      'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                      path === item.href ? 'bg-accent' : 'transparent',
                      item.disabled && 'cursor-not-allowed opacity-80'
                    )}
                    onClick={() => {
                      if (setOpen) setOpen(false);
                    }}
                  >
                    <Icon className={`ml-3 size-5`} />

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
    </nav>
  );
}

// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';

// import { Icons } from '@/components/icons';
// import { cn } from '@/lib/utils';
// import { NavItem } from '@/types';
// import { Dispatch, SetStateAction } from 'react';
// import { useSidebar } from '@/hooks/useSidebar';
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger
// } from './ui/tooltip';

// interface DashboardNavProps {
//   items: NavItem[];
//   setOpen?: Dispatch<SetStateAction<boolean>>;
//   isMobileNav?: boolean;
// }

// export function DashboardNav({
//   items,
//   setOpen,
//   isMobileNav = false
// }: DashboardNavProps) {
//   const path = usePathname(); // Obtém o caminho atual da URL
//   const { isMinimized } = useSidebar();

//   if (!items?.length) {
//     return null;
//   }

//   return (
//     <nav className="grid items-start gap-2">
//       <TooltipProvider>
//         {items.map((item, index) => {
//           const Icon = Icons[item.icon || 'arrowRight'];

//           // Verifica se o caminho é exatamente igual ao item.href (ex: /dashboard)
//           const isExactMatch = path === item.href;

//           // Verifica se é uma subrota válida (ex: /dashboard/access-requests), excluindo "/dashboard"
//           const isSubRoute = path.startsWith(item.href + '/') && item.href !== '/dashboard';

//           // Define o item como ativo se for uma correspondência exata ou subrota
//           const isActive = isExactMatch || isSubRoute;

//           return (
//             item.href && (
//               <Tooltip key={index}>
//                 <TooltipTrigger asChild>
//                   <Link
//                     href={item.disabled ? '/' : item.href}
//                     className={cn(
//                       'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
//                       // Marca como ativo se isActive for verdadeiro
//                       isActive
//                         ? 'bg-accent text-accent-foreground'
//                         : 'transparent',
//                       item.disabled && 'cursor-not-allowed opacity-80'
//                     )}
//                     onClick={() => {
//                       if (setOpen) setOpen(false);
//                     }}
//                   >
//                     <Icon className={`ml-3 size-5`} />

//                     {isMobileNav || (!isMinimized && !isMobileNav) ? (
//                       <span className="mr-2 truncate">{item.title}</span>
//                     ) : (
//                       ''
//                     )}
//                   </Link>
//                 </TooltipTrigger>
//                 <TooltipContent
//                   align="center"
//                   side="right"
//                   sideOffset={8}
//                   className={!isMinimized ? 'hidden' : 'inline-block'}
//                 >
//                   {item.title}
//                 </TooltipContent>
//               </Tooltip>
//             )
//           );
//         })}
//       </TooltipProvider>
//     </nav>
//   );
// }
