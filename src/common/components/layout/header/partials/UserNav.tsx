import { ChevronDown, HelpCircle, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../external/ui/avatar.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../../../../external/ui/dropdown-menu.tsx";
import { Link } from "react-router-dom";
import { authService } from "../../../../../features/auth/common/AuthService.ts";

export function UserNav() {

  const signOut = async () => {
    await authService.signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative rounded-full flex flex-row items-center cursor-pointer">
          <Avatar className="h-10 w-10 mr-4">
            <AvatarImage src="/img/ap.svg" alt={""} />
            <AvatarFallback>Nome do Usuário</AvatarFallback>
          </Avatar>

          <div className="flex flex-col space-y-1 mr-2">
            <p className="text-sm font-medium leading-none">Nome do Usuário</p>
            <p className="text-xs leading-none text-muted-foreground">usuario@accesspilot.com</p>
          </div>

          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
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
