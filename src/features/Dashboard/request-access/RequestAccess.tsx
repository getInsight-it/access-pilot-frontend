import { Breadcrumbs } from '../../../components/breadcrumbs';
import { RequestAccessForm } from '../../../components/forms/request-access-form';
import { ScrollArea } from '../../../components/ui/scroll-area';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Solicitar acesso', link: '/dashboard/request-access/create' }
];
export default function RequestAccess() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <RequestAccessForm />
        
      </div>
    </ScrollArea>
  );
}
