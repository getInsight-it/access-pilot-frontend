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
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-default" />
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
        <DropdownMenuItem onClick={() => changeTheme("blue")}>
          Soft blue
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("red")}>
          Red
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("green")}>
          Green
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("purple")}>
          Purple
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("govbr")}>
          GovBr
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("apple")}>
          Apple (Dark)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("cyberpunk")}>
          Cyberpunk (Dark)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("neon")}>
          Neon (Dark)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
