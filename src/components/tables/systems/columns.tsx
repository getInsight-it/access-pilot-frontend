'use client'
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import Systems from '@/constants/systems.json';
import { Checkbox } from '@/components/ui/checkbox';
import TrafficLight from '@/components/TrafficLights';
import { CircleCheckBig, CircleOff } from 'lucide-react';
import { SystemDetailDrawer } from '@/components/drawers/SystemDetailDrawer';

type System = {
  id: number;
  name: string;
  description: string;
  status: string;
  managed: boolean;
  published: boolean;
};

const systems: System[] = Systems as System[];

const statusColors: Record<string, string> = {
  gerenciado: 'px-3 py-1 rounded font-normal bg-green-200 text-green-800 block text-center w-32 text-sm',
  pendente: 'px-3 py-1 rounded font-normal bg-slate-200 text-slate-800 block text-center w-32 text-sm',
  rejeitado: 'px-3 py-1 rounded font-normal bg-yellow-200 text-yellow-800 block text-center w-32 text-sm',
  'em progresso': 'px-3 py-1 rounded font-normal bg-blue-200 text-blue-800 block text-center w-32 text-sm',
};

export const columns: ColumnDef<System>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Selecionar todos"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Selecionar linha"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false
  // },
  // {
  //   accessorKey: 'id',
  //   header: 'ID DA SOLICITAÇÃO'
  // },
  {
    accessorKey: 'name',
    header: 'SISTEMA'
  },
  {
    accessorKey: 'description',
    header: 'DESCRIÇÃO'
  },
  // {
  //   accessorKey: 'managed',
  //   header: 'Gerenciado',
  //   cell: ({ row }) => {
  //     const isManaged = row.original.managed;
  //     return (
  //       <div className="flex">
  //         {isManaged ? (
  //           <CircleCheckBig className="text-green-600" />
  //         ) : (
  //           <CircleOff className="text-red-600" />
  //         )}
  //       </div>
  //     );
  //   }
  // },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => (
      <div className="flex gap-x-2 items-center">
        <TrafficLight managed={row.original.managed} published={row.original.published} />
        <p>
          {row.original.managed 
            ? row.original.published 
              ? 'Publicado' 
              : 'Gerenciado' 
            : 'Não gerenciado'}
        </p>
      </div>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  },
  {
    id: 'details',
    cell: ({ row }) => <SystemDetailDrawer />
  }
];




// 'use client'
// import { ColumnDef } from '@tanstack/react-table';
// import { CellAction } from './cell-action';
// import Systems from '@/constants/systems.json';
// import { Checkbox } from '@/components/ui/checkbox';
// import TrafficLight from '@/components/TrafficLights';
// import { CircleCheckBig, CircleOff } from 'lucide-react';

// type System = {
//   id: number;
//   name: string;
//   description: string;
//   status: string;
//   managed: boolean;
// };

// const systems: System[] = Systems as System[];

// interface StatusColors {
//   [key: string]: string;
//   gerenciado: string;
//   pendente: string;
//   rejeitado: string;
//   'em progresso': string;
// }

// const statusColors: StatusColors = {
//   gerenciado: 'px-3 py-1 rounded font-normal bg-green-200 text-green-800 block text-center w-32 text-sm',
//   pendente: 'px-3 py-1 rounded font-normal bg-slate-200 text-slate-800 block text-center w-32 text-sm',
//   rejeitado: 'px-3 py-1 rounded font-normal bg-yellow-200 text-yellow-800 block text-center w-32 text-sm',
//   'em progresso': 'px-3 py-1 rounded font-normal bg-blue-200 text-blue-800 block text-center w-32 text-sm',
// };

// export const columns: ColumnDef<System>[] = [
//   {
//     id: 'select',
//     header: ({ table }) => (
//       <Checkbox
//         checked={table.getIsAllPageRowsSelected()}
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Selecionar todos"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Selecionar linha"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false
//   },
//   {
//     accessorKey: 'id',
//     header: 'ID DA SOLICITAÇÃO'
//   },
//   {
//     accessorKey: 'name',
//     header: 'SISTEMA'
//   },
//   {
//     accessorKey: 'description',
//     header: 'DESCRIÇÃO'
//   },
//   {
//     accessorKey: 'managed',
//     header: 'Gerenciado',
//     cell: ({ row }) => {
//       const status = row.original.status.toLowerCase();
//       const statusClass = statusColors[status] || 'px-3 py-1 rounded font-normal bg-slate-200 text-slate-800 block text-center w-32 text-sm';
//       return <>
//         <span className={statusClass}>{status}</span>
//         <CircleCheckBig />
//         <CircleOff />
//       </>;
//     }
//   },
//   {
//     accessorKey: 'status',
//     header: 'STATUS',
//     cell: ({ row }) => <TrafficLight />
//   },
//   {
//     id: 'actions',
//     cell: ({ row }) => <CellAction data={row.original} />
//   }
// ];
