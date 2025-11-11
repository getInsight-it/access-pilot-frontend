import { ChevronDown, HelpCircle, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../external/ui/avatar.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../../external/ui/dropdown-menu.tsx";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../../../../features/auth/common/AuthService.ts";
import useAuthStore from "../../../../../store/authStore.ts";
import { PRIVATE_ROUTES } from "../../../../constants/routes.ts";

export function UserNav() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const signOut = async () => {
    await authService.signOut();
    navigate("/login");
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.username) {
      return user.username;
    }
    return "Usuário";
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return "U";
  };

  const displayName = getUserDisplayName();
  const initials = getUserInitials();
  const email = user?.email || "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative rounded-full flex flex-row items-center cursor-pointer min-w-0">
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 md:mr-4 flex-shrink-0">
            <AvatarImage src="/img/ap.svg" alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="hidden md:flex flex-col space-y-1 mr-2 min-w-0">
            <p className="text-sm font-medium leading-none truncate">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">{email}</p>
          </div>

          <ChevronDown className="hidden md:block w-4 h-4 text-gray-400 flex-shrink-0" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="md:hidden">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground font-normal">{email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
        </div>
        <Link className="flex items-center p-2 text-sm hover:opacity-55" to={PRIVATE_ROUTES.PROFILE}>
          <User className="w-4 h-4 mr-2" />
          Perfil
        </Link>
        <Link className="flex items-center p-2 text-sm hover:opacity-55" to={PRIVATE_ROUTES.HELP_AND_SUPPORT}>
          <HelpCircle className="w-4 h-4 mr-2" />
          Ajuda e suporte
        </Link>
        <Link className="flex items-center p-2 text-sm hover:opacity-55" onClick={signOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
