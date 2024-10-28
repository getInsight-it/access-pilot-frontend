import { Breadcrumbs } from '@/components/breadcrumbs';
import { RequestAccessForm } from '@/components/forms/request-access-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Minhas solicitações de acesso', link: '/dashboard/my-access-requests' },
  { title: 'Criar', link: '/dashboard/my-access-requests/create' }
];

export default function Page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <RequestAccessForm
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

// Esta função gera os parâmetros estáticos para cada solicitação de acesso
export async function generateStaticParams() {
  // Simula a busca das solicitações de acesso da sua API ou base de dados
  const accessRequests = [
    { _id: '1', requester: 'João', system: 'Sistema ABC', role: 'Administrador', status: 'Em progresso' },
    { _id: '2', requester: 'Maria', system: 'Sys XYZ', role: 'Gerente', status: 'Pendente' }
  ];

  // Mapeia as solicitações para gerar os parâmetros de rota estática
  return accessRequests.map((request) => ({
    requestId: request._id,
  }));
}