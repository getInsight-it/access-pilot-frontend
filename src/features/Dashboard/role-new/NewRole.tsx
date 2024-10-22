import { Breadcrumbs } from '../../../components/breadcrumbs';
import { RoleForm } from '../../../components/forms/role-form';
import { ScrollArea } from '../../../components/ui/scroll-area';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Gerenciar funções', link: '/dashboard/roles' },
  { title: 'Criar', link: '/dashboard/roles/role-new' }
];
export default function NewRole() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <RoleForm
          systems={[
            { _id: '1', name: 'Sistema ABC' },
            { _id: '2', name: 'Sys XYZ' }
          ]}
          roles={[
            { _id: '1', name: 'Administrador' },
            { _id: '2', name: 'Gerente' },
            { _id: '3', name: 'Usuário' }
          ]}
          initialData={null}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}

export async function generateStaticParams() {
  // Simula a busca dos roles da sua API ou base de dados
  const roles = [
    { _id: '1', name: 'Administrador' },
    { _id: '2', name: 'Gerente' },
    { _id: '3', name: 'Usuário' }
  ];

  // Mapeia os roles para gerar os parâmetros de rota estática
  const roleParams = roles.map((role) => ({
    roleId: role._id,
  }));

  // Adiciona o parâmetro "new" para a página de criação
  const newParam = { roleId: 'new' };

  return [...roleParams, newParam];
}
