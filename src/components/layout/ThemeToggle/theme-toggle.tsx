// import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from './theme-provider'; // Usando o contexto que criamos

import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../ui/dropdown-menu';
import { Moon, Sun } from 'lucide-react';

type CompProps = {};

export default function ThemeToggle({}: CompProps) {
  const { setTheme } = useTheme(); // Usando o contexto customizado
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('tangerine')}>
          Tangerine
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('rnp')}>
          RNP
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('gov')}>
          Gov BR
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
