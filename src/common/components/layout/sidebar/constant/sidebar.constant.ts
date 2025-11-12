import { NavItem } from "../../../../types";
import { UserRoleEnum } from "../../../../types/user/user.model.ts";

export const navItems: NavItem[] = [
  {
    title: "Minhas solicitações",
    href: "/my-access-requests",
    icon: "book",
    label: "Minhas solicitações"
  },
  {
    title: "Solicitar acesso",
    href: "/request-access",
    icon: "key",
    label: "Solicitar acesso"
  },
  {
    title: "Dashboard",
    href: "/dashboard/general-info",
    icon: "dashboard",
    label: "Dashboard",
    protected: true,
  },
  {
    title: "Gerenciar sistemas",
    href: "/systems",
    icon: "cog",
    label: "Gerenciar Sistemas",
    protected: true,
    roles: [UserRoleEnum.ADMIN]
  },
  {
    title: "Gerenciar solicitações",
    href: "/access-requests",
    icon: "bookuser",
    label: "Gerenciar solicitações",
    protected: true,
    roles: [UserRoleEnum.APPROVER]
  },
  {
    title: "Gerenciar esferas",
    href: "/levels",
    icon: "globe2",
    label: "Gerenciar esferas",
    protected: true,
    roles: [UserRoleEnum.ADMIN]
  }
];

export const supportNavItems: NavItem[] = []
