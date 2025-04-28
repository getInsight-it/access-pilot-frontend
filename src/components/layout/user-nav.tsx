import { HelpCircle, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar.tsx";
import { Button } from "../ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu.tsx";
import { Link } from "react-router-dom";
import { authService } from "../../features/auth/common/AuthService.ts";

export function UserNav() {

  const signOut = async () => {
    await authService.signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src="/img/ap.svg"
              alt={""}
            />
            <AvatarFallback>Nome do Usuário</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              Nome do Usuário
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              usuario@accesspilot.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link className="flex items-center p-2 text-sm hover:opacity-55" to="/dashboard/profile">
          <User className="w-4 h-4 mr-2" />
          Perfil
        </Link>
        <Link className="flex items-center p-2 text-sm hover:opacity-55" to="/dashboard/help">
          <HelpCircle className="w-4 h-4 mr-2" />
          Ajuda e suporte
        </Link>
        <Link className="flex items-center p-2 text-sm hover:opacity-55" to="/login" onClick={signOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
