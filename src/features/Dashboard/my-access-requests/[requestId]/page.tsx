import {Breadcrumbs} from '@/components/breadcrumbs';
import {AccessRequestForm} from '@/components/forms/access-request-form';
import {ScrollArea} from '@/components/ui/scroll-area';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Solicitações de acesso', link: '/dashboard/access-requests' },
  { title: 'Solicitar acesso', link: '/dashboard/access-requests/create' }
];
export default function Page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <AccessRequestForm
          statuses={[
            { _id: 'PUBLISHED', name: 'Publicado' },
            { _id: 'UNPUBLISHED', name: 'Não Publicado' }
          ]}
          initialData={null}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
