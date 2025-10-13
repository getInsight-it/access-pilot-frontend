import { useTheme } from "./theme-provider.tsx";

import { Button } from "../common/external/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../common/external/ui/dropdown-menu.tsx";
import { Sun } from "lucide-react";

export default function ThemeToggle() {
  const { changeTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
          <Sun className="h-4 w-4 sm:h-[1.2rem] sm:w-[1.2rem] rotate-0 scale-100 transition-all text-default" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("govbr")}>
          GovBr
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
