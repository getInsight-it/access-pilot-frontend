import { Breadcrumbs } from '@/components/breadcrumbs';
import { SystemForm } from '@/components/forms/system-form';
import { ScrollArea } from '@/components/ui/scroll-area';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Gerenciar Sistemas', link: '/dashboard/system' },
  { title: 'Criar', link: '/dashboard/system/new' }
];
export default function Page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <SystemForm
          statuses={[
            { _id: 'Gerenciado', name: 'Gerenciado' },
            { _id: 'Não gerenciado', name: 'Não gerenciado' }
          ]}
          initialData={null}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}

// Esta função gera os parâmetros estáticos para cada sistema e para a página de criação
export async function generateStaticParams() {
  // Simula a busca dos sistemas da sua API ou base de dados
  const systems = [
    { _id: '1', name: 'Sistema ABC', status: 'Gerenciado' },
    { _id: '2', name: 'Sys XYZ', status: 'Não gerenciado' }
  ];

  // Mapeia os sistemas para gerar os parâmetros de rota estática
  const systemParams = systems.map((system) => ({
    systemId: system._id,
  }));

  // Adiciona o parâmetro "new" para a página de criação
  const newParam = { systemId: 'new' };

  return [...systemParams, newParam];
}