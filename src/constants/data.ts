import { NavItem } from '@/types';

export type System = {
  id: number;
  name: string;
  description: string;
  role: string;
  verified: boolean;
  status: string;
};
export const systems: System[] = [
  {
    id: 1,
    name: 'Portal HR',
    description: 'Sistema de Gestão de Recursos Humanos',
    role: 'Desenvolvedor Frontend',
    verified: false,
    status: 'Gerenciado'
  },
  {
    id: 2,
    name: 'CRM',
    description: 'Sistema de gerenciamento de relacionamento com o cliente',
    role: 'Desenvolvedor Backend',
    verified: true,
    status: 'Gerenciado'
  },
  {
    id: 3,
    name: 'Painel de análise',
    description: 'Plataforma de Business Intelligence e Analytics',
    role: 'UI Designer',
    verified: true,
    status: 'Não gerenciado'
  },
];

export type AccessRequest = {
  id: number;
  requester: string;
  system: string;
  role: string;
  date: string;
  status: string;
};
export const accessRequests: AccessRequest[] = [
  {
    id: 1,
    requester: 'Maria Lorem Ipsum',
    system: 'Portal HR',
    role: 'Gerente',
    date: '18/07/2024',
    status: 'Em progresso'
  },
  {
    id: 2,
    requester: 'Lorem Ipsum',
    system: 'CRM',
    role: 'Gerente',
    date: '18/07/2024',
    status: 'Pendente'
  },
  {
    id: 3,
    requester: 'Lorem Ipsum',
    system: 'Painel de análise',
    role: 'Usuário',
    date: '18/07/2024',
    status: 'Aprovado'
  },
  {
    id: 4,
    requester: 'Lorem Ipsum',
    system: 'Painel de dados',
    role: 'Administrador',
    date: '18/07/2024',
    status: 'Rejeitado'
  },
];

export type Role = {
  id: number;
  name: string;
  description: string;
  role: string;
  parentRole: string;
  verified: boolean;
};
export const roles: Role[] = [
  {
    id: 1,
    name: 'Diretor',
    description: 'Acesso total às funções de RH e decisões estratégicas',
    role: 'Administrador',
    parentRole: '-',
    verified: false
  },
  {
    id: 2,
    name: 'Gerente',
    description: 'Acesso total às funções',
    role: 'Gerente',
    parentRole: 'Diretor',
    verified: true
  },
  {
    id: 3,
    name: 'Administrador',
    description: 'Gerenciar operações e equipe de RH',
    role: 'Administrador',
    parentRole: 'Gerente',
    verified: true
  },
  {
    id: 4,
    name: 'Usuario',
    description: 'Apoiar as operações de RH',
    role: 'Usuario',
    parentRole: 'Administrador',
    verified: false
  },
  
];

export type AccessRequests = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
  
  system: string;
  role: string;
  requester: string;
  date_submission: string;
  status: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Minhas solicitações',
    href: '/dashboard/my-access-requests',
    icon: 'book',
    label: 'Minhas solicitações'
  },
  {
    title: 'Solicitar acesso',
    href: '/dashboard/request-access',
    icon: 'key',
    label: 'Solicitar acesso'
  },
  {
    title: 'Ajuda e suporte',
    href: '/dashboard/help',
    icon: 'question',
    label: 'Ajuda e suporte'
  },
  {
    title: 'Gerenciar sistemas',
    href: '/dashboard/systems',
    icon: 'cog',
    label: 'Gerenciar Sistemas'
  },
  {
    title: 'Gerenciar funções',
    href: '/dashboard/roles',
    icon: 'user',
    label: 'Gerenciar funções'
  },
  {
    title: 'Solicitações de acesso',
    href: '/dashboard/access-requests',
    icon: 'bookuser',
    label: 'Solicitações de acesso'
  },
  {
    title: 'Sair',
    href: '/',
    icon: 'login',
    label: 'login'
  }
];
