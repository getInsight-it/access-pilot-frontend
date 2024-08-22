import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle';
import { cn } from '@/lib/utils';
import { MobileSidebar } from './mobile-sidebar';
import { UserNav } from './user-nav';
import Link from 'next/link';
import Notifications from '../Notifications';
import Image from 'next/image';

export default function Header() {
  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-18 items-center justify-between px-4">
        <div className="hidden lg:block">
          <Link
            href={'#'}
            target="_blank"
          >

            <Image
              className="mx-2 h-20 w-60 block dark:hidden"
              src="/accesspilot.svg"
              width={500}
              height={500}
              alt="Logo accesspilot"
              priority={true}
            />

            <Image
              className="mr-2 h-20 w-60 hidden dark:block"
              src="/accesspilot-w.svg"
              width={500}
              height={500}
              alt="Logo accesspilot"
              priority={true}
            />
            
          </Link>
        </div>
        <div className={cn('block lg:!hidden')}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <Notifications />
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
