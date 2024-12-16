import ThemeToggle from '../../components/layout/ThemeToggle/theme-toggle';
import { cn } from '../../lib/utils';
import { MobileSidebar } from './mobile-sidebar';
import { UserNav } from './user-nav';
import Notifications from '../Notifications';
import ThemedLogo from './ThemedLogo';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-18 items-center justify-between px-4">
        <div className="hidden lg:block">
          <Link
            className=""
            to={'#'} // Alterado de 'href' para 'to'
            // target="_blank"
          >
            <ThemedLogo />
          </Link>
        </div>
        <div className={cn('block lg:!hidden')}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-4">
          <Notifications />
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
