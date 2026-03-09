import { NavItem } from "../../../../types";
import { UserRoleEnum } from "../../../../types/user/user.model.ts";

export const primaryNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/general-info",
    icon: "dashboard",
    label: "Dashboard",
    protected: true,
  },
  {
    title: "Minhas solicitações",
    href: "/my-access-requests",
    icon: "post",
    label: "Minhas solicitações"
  },
  {
    title: "Solicitar acesso",
    href: "/request-access",
    icon: "hand",
    label: "Solicitar acesso"
  },
  {
    title: "Gerenciar solicitações",
    href: "/access-requests",
    icon: "bookuser",
    label: "Gerenciar solicitações",
    protected: true,
    roles: [UserRoleEnum.APPROVER]
  },
];

export const administrationNavItems: NavItem[] = [
  {
    title: "Gerenciar sistemas",
    href: "/systems",
    icon: "settings",
    label: "Gerenciar Sistemas",
    protected: true,
    roles: [UserRoleEnum.ADMIN]
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

export const supportNavItems: NavItem[] = [];

export const navItems: NavItem[] = [
  ...primaryNavItems,
  ...administrationNavItems,
  ...supportNavItems
];
