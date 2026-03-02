import {ChevronDown, HelpCircle, LogOut} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@common/external/ui/dropdown-menu";
import {PRIVATE_ROUTES} from "@common/constants/routes";
import {authService} from "@features/auth/common/AuthService";
import {Link, useNavigate} from "react-router-dom";
import {Avatar, AvatarFallback, AvatarImage} from "@common/external/ui/avatar";

import useAuthStore from "@store/authStore";

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
        <div>
          <Avatar>
            {/* <AvatarImage src="/img/ap.svg" alt={displayName} /> */}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div>
            <p>{displayName}</p>
            <p>{email}</p>
          </div>

          <ChevronDown />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount>
        <div>
          <DropdownMenuLabel>
            <div>
              <p>{displayName}</p>
              <p>{email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
        </div>
        <Link to={PRIVATE_ROUTES.HELP_AND_SUPPORT}>
          <HelpCircle />
          Ajuda e suporte
        </Link>
        <div onClick={signOut}>
          <LogOut />
          Sair
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
