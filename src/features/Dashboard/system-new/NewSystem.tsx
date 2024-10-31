import {Breadcrumbs} from '../../../components/breadcrumbs';
import {SystemForm} from '../../../components/forms/system-form';
import {ScrollArea} from '../../../components/ui/scroll-area';

const breadcrumbItems = [
  {title: 'Dashboard', link: '/dashboard'},
  // { title: 'Gerenciar Sistemas', link: '/dashboard/systems/' },
  {title: 'Adicionar novo sistema', link: ''}
];


export default function NewSystem({data}) {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems}/>
        <SystemForm
          initialData={data || null}
        />
      </div>
    </ScrollArea>
  );
}
