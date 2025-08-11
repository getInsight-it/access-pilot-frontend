import { NavItem } from "../../../../types";
import { UserRoleEnum } from "../../../../types/user/user.model.ts";

export const navItems: NavItem[] = [
  {
    title: "Minhas solicitações",
    href: "/dashboard/my-access-requests",
    icon: "book",
    label: "Minhas solicitações"
  },
  {
    title: "Solicitar acesso",
    href: "/dashboard/request-access",
    icon: "key",
    label: "Solicitar acesso"
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
    protected: true,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.APPROVER]
  },
  {
    title: "Gerenciar sistemas",
    href: "/dashboard/systems",
    icon: "cog",
    label: "Gerenciar Sistemas",
    protected: true,
    roles: [UserRoleEnum.ADMIN]
  },
  {
    title: "Gerenciar solicitações",
    href: "/dashboard/access-requests",
    icon: "bookuser",
    label: "Gerenciar solicitações",
    protected: true,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.APPROVER]
  },
  {
    title: "Gerenciar esferas",
    href: "/dashboard/levels",
    icon: "globe2",
    label: "Gerenciar esferas",
    protected: true,
    roles: [UserRoleEnum.ADMIN]
  }
];

export const supportNavItems: NavItem[] = [
  // {
  //   title: "Ajuda",
  //   href: "/dashboard/levels",
  //   icon: "globe2",
  //   label: "Ajuda",
  //   protected: false,
  // },
  // {
  //   title: "Configurações",
  //   href: "/dashboard/levels",
  //   icon: "globe2",
  //   label: "Configurações",
  //   protected: false,
  // }
]
