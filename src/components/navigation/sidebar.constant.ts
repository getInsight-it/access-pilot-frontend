import { NavItem } from "../../common/types";

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
    protected: true
  },
  {
    title: "Gerenciar sistemas",
    href: "/dashboard/systems",
    icon: "cog",
    label: "Gerenciar Sistemas",
    protected: true
  },
  {
    title: "Gerenciar solicitações",
    href: "/dashboard/access-requests",
    icon: "bookuser",
    label: "Gerenciar solicitações",
    protected: true
  },
  {
    title: "Gerenciar esferas",
    href: "/dashboard/levels",
    icon: "globe2",
    label: "Gerenciar esferas",
    protected: true
  }
];
