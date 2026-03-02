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
        <Button variant="outline" size="icon">
          <Sun />
          <span>Toggle theme</span>
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
