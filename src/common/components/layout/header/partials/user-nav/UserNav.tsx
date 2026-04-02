import { ChevronDown, HelpCircle, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@common/external/ui/dropdown-menu";
import { PRIVATE_ROUTES } from "@common/constants/routes";
import { authService } from "@features/auth/common/AuthService";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "@store/authStore";
import { useI18n } from "@common/context/i18n/I18nContext";
import "./user-nav.scss";

export function UserNav() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { t } = useI18n();

  const signOut = async () => {
    await authService.signOut();
    navigate("/login");
  };

  const getUserDisplayName = () => {
    if(user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if(user?.firstName) {
      return user.firstName;
    }
    if(user?.username) {
      return user.username;
    }
    return t("Usuário");
  };

  const displayName = getUserDisplayName();
  const email = user?.email || t("E-mail não informado");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="user-nav__trigger" aria-label={t("Abrir menu do usuário")}>
          <span className="user-nav__avatar-box">
            <img className="user-nav__avatar-image" src="/avatars/03.png" alt={displayName} />
          </span>
          <span className="user-nav__identity">
            <span className="user-nav__name">{displayName}</span>
            <span className="user-nav__email">{email}</span>
          </span>
          <ChevronDown className="user-nav__chevron" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="user-nav__menu" forceMount>
        <DropdownMenuLabel className="user-nav__menu-header">
          <span className="user-nav__menu-name">{displayName}</span>
          <span className="user-nav__menu-email">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link className="user-nav__menu-item" to={PRIVATE_ROUTES.HELP_AND_SUPPORT}>
            <HelpCircle className="user-nav__menu-item-icon" />
            <span>{t("Ajuda e suporte")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={signOut}>
          <span className="user-nav__menu-item">
            <LogOut className="user-nav__menu-item-icon" />
            <span>{t("Sair")}</span>
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
