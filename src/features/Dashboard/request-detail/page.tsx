import { Breadcrumbs } from '@/components/breadcrumbs';
import { Supports } from '@/components/supports/Supports';
import { Heading } from '@/components/ui/heading';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Solicitações de acesso', link: '/dashboard/access-requests' },
  { title: 'Detalhe da solicitação', link: '/dashboard/request-access/create' }
];
export default function Page() {
  return (
    <ScrollArea className="h-full">
        
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title={`Detalhe da solicitação de acesso XYZ92687`}
          description="Gerenciar solicitações de acesso."
        />

        {/* <Link
          href={'/dashboard/request-access/'}
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          <Plus className="mr-2 h-4 w-4" /> Adicionar novo
        </Link> */}
      </div>
      
      <Separator />
      
      <Supports />
      
      </div>
    </ScrollArea>
  );
}
