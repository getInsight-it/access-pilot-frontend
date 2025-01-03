import { Breadcrumbs } from '../../../components/breadcrumbs';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { RequestDetail } from '../../../components/request-detail/RequestDetail';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Minhas solicitações', link: '/dashboard/access-requests' },
  { title: 'Detalhe da solicitação', link: '/dashboard/request-access/create' }
];
export default function RequestDetailPage() {
  return (
    <ScrollArea className="h-full">

      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

      <RequestDetail origin={origin} />

      </div>
    </ScrollArea>
  );
}
