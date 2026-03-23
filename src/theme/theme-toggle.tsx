import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider.tsx";

import { Button } from "../common/external/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../common/external/ui/dropdown-menu.tsx";
import "./theme-toggle.scss";

export default function ThemeToggle() {
  const { changeTheme, theme } = useTheme();

  const renderCurrentThemeIcon = () => {
    if (theme === "gov") {
      return (
        <img
          className="theme-toggle__trigger-logo"
          src="/govbr/logo.svg"
          alt="GOV.BR"
        />
      );
    }

    const CurrentIcon = theme === "dark" ? Moon : Sun;
    return <CurrentIcon className="theme-toggle__trigger-icon" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="white" size="icon" className="theme-toggle__trigger" aria-label="Alterar tema">
          {renderCurrentThemeIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="theme-toggle__menu">
        <DropdownMenuItem
          className={`theme-toggle__menu-item${theme === "light" ? " theme-toggle__menu-item--active" : ""}`}
          onClick={() => changeTheme("light")}
        >
          <Sun className="theme-toggle__menu-item-icon" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`theme-toggle__menu-item${theme === "dark" ? " theme-toggle__menu-item--active" : ""}`}
          onClick={() => changeTheme("dark")}
        >
          <Moon className="theme-toggle__menu-item-icon" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`theme-toggle__menu-item${theme === "gov" ? " theme-toggle__menu-item--active" : ""}`}
          onClick={() => changeTheme("gov")}
        >
          <img
            className="theme-toggle__menu-item-logo"
            src="/govbr/logo.svg"
            alt="GOV.BR"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
