// import { Breadcrumbs } from '@/components/breadcrumbs';
// import { columns } from '@/components/tables/my-access-requests/columns';
// import { Button, buttonVariants } from '@/components/ui/button';
// import { Heading } from '@/components/ui/heading';
// import { Separator } from '@/components/ui/separator';
// import { cn } from '@/lib/utils';
// import { Plus } from 'lucide-react';
// import Link from 'next/link';
// import { SystemsTable } from '@/components/tables/systems/systems';
// import localData from '@/constants/systems.json';

// const breadcrumbItems = [
//   { title: 'Dashboard', link: '/dashboard' },
//   { title: 'Gerenciar sistemas', link: '/dashboard/system' }
// ];

// type paramsProps = {
//   searchParams: {
//     [key: string]: string | string[] | undefined;
//   };
// };

// export const dynamic = 'force-static'

// export default function Page({ searchParams }: paramsProps) {
//   const page = Array.isArray(searchParams.page) ? Number(searchParams.page[0]) : Number(searchParams.page) || 1;
//   const pageLimit = Array.isArray(searchParams.limit) ? Number(searchParams.limit[0]) : Number(searchParams.limit) || 10;
//   const name = Array.isArray(searchParams.search) ? searchParams.search[0] : searchParams.search || null;
//   const offset = (page - 1) * pageLimit;

//   // Filtrar os dados do JSON local de acordo com os parâmetros de pesquisa
//   const filteredData = localData.filter(item => 
//     !name || item.name.includes(name)
//   );
//   const totalUsers = filteredData.length;
//   const pageCount = Math.ceil(totalUsers / pageLimit);
//   const systems = filteredData.slice(offset, offset + pageLimit);

//   return (
//     <>
//       <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
//         <Breadcrumbs items={breadcrumbItems} />

//         <div className="flex items-start justify-between">
//           <Heading
//             title={`Sistemas (${totalUsers})`}
//             description="Gerenciar sistemas."
//           />
//           <Button
//             className={cn(buttonVariants({ variant: 'default' }))}
//             // onClick={() => router.push(`/dashboard/system/new`)}
//           >
//             <Plus className="mr-2 h-4 w-4" /> Adicionar novo
//           </Button>
//         </div>
//         <Separator />

//         <SystemsTable
//           searchKey="name"
//           pageNo={page}
//           columns={columns}
//           totalUsers={totalUsers}
//           data={systems}
//           pageCount={pageCount}
//         />
//       </div>
//     </>
//   );
// }



// 'use client'
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SystemsTable } from '@/components/tables/systems/systems';
import { columns } from '@/components/tables/systems/columns';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import localData from '@/constants/systems.json';
// import { useRouter } from 'next/navigation';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Gerenciar sistemas', link: '/dashboard/system' }
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export const dynamic = 'force-static'

export default function Page({ searchParams }: paramsProps) {
  const page = Array.isArray(searchParams.page) ? Number(searchParams.page[0]) : Number(searchParams.page) || 1;
  const pageLimit = Array.isArray(searchParams.limit) ? Number(searchParams.limit[0]) : Number(searchParams.limit) || 10;
  const name = Array.isArray(searchParams.search) ? searchParams.search[0] : searchParams.search || null;
  const offset = (page - 1) * pageLimit;

  // Filtrar os dados do JSON local de acordo com os parâmetros de pesquisa
  const filteredData = localData.filter(item => 
    !name || item.name.includes(name)
  );
  const totalUsers = filteredData.length;
  const pageCount = Math.ceil(totalUsers / pageLimit);
  const systems = filteredData.slice(offset, offset + pageLimit);

  // const router = useRouter();

  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Sistemas (${totalUsers})`}
            description="Gerenciar sistemas."
          />
          <Button
            className={cn(buttonVariants({ variant: 'default' }))}
            // onClick={() => router.push(`/dashboard/system/new`)}
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar novo
          </Button>
        </div>
        <Separator />

        <SystemsTable
          searchKey="name"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          data={systems}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}
