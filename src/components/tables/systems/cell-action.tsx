// // 'use client';
// // import { AlertModal } from '@/components/modal/alert-modal';
// // import { Button } from '@/components/ui/button';
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuLabel,
// //   DropdownMenuTrigger
// // } from '@/components/ui/dropdown-menu';
// // import AccessRequests from '@/constants/access-requests.json';
// // import { Edit, MoreHorizontal, Trash } from 'lucide-react';
// // import { useParams, useRouter } from 'next/navigation';
// // import { useState } from 'react';

// // interface CellActionProps {
// //   data: typeof AccessRequests;
// // }

// // export const CellAction: React.FC<CellActionProps> = ({ data }) => {
// //   const [loading, setLoading] = useState(false);
// //   const [open, setOpen] = useState(false);
// //   const router = useRouter();

// //   const onConfirm = async () => {};

// //   return (
// //     <>
// //       <AlertModal
// //         isOpen={open}
// //         onClose={() => setOpen(false)}
// //         onConfirm={onConfirm}
// //         loading={loading}
// //       />
// //       <DropdownMenu modal={false}>
// //         <DropdownMenuTrigger asChild>
// //           <Button variant="ghost" className="h-8 w-8 p-0">
// //             <span className="sr-only">Abrir menu</span>
// //             <MoreHorizontal className="h-4 w-4" />
// //           </Button>
// //         </DropdownMenuTrigger>
// //         <DropdownMenuContent align="end">
// //           <DropdownMenuLabel>Ações</DropdownMenuLabel>

// //           <DropdownMenuItem
// //             onClick={() => router.push(`/dashboard/access-requests/${data.id}`)}
// //           >
// //             <Edit className="mr-2 h-4 w-4" /> Atualizar
// //           </DropdownMenuItem>
// //           <DropdownMenuItem onClick={() => setOpen(true)}>
// //             <Trash className="mr-2 h-4 w-4" /> Apagar
// //           </DropdownMenuItem>
// //         </DropdownMenuContent>
// //       </DropdownMenu>
// //     </>
// //   );
// // };


// 'use client';
// import { AlertModal } from '@/components/modal/alert-modal';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu';
// import { Cog, Eye, FileKey, FileKey2, MoreHorizontal, Trash } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';

// interface CellActionProps {
//   data: {
//     id: number;
//     name: string;
//     description: string;
//     status: string;
//     managed: boolean;
//     published: boolean;
//   };
// }

// export const CellAction: React.FC<CellActionProps> = ({ data }) => {
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const router = useRouter();

//   const onConfirm = async () => {};

//   return (
//     <>
//       <AlertModal
//         isOpen={open}
//         onClose={() => setOpen(false)}
//         onConfirm={onConfirm}
//         loading={loading}
//       />
//       <DropdownMenu modal={false}>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" className="h-8 w-8 p-0">
//             <span className="sr-only">Abrir menu</span>
//             <MoreHorizontal className="h-4 w-4" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           <DropdownMenuLabel>Ações</DropdownMenuLabel>

//           {/* Ação para Detalhar */}
//           <DropdownMenuItem
//             onClick={() => router.push(`/dashboard/request-detail/`)}
//           >
//             <Eye className="mr-2 h-4 w-4" /> Detalhar
//           </DropdownMenuItem>

//           {/* Ação para Gerenciar (apenas para sistemas não gerenciados) */}
//           {!data.managed && (
//             <DropdownMenuItem
//               onClick={() => router.push(`/dashboard/request-detail/`)}
//             >
//               <Cog className="mr-2 h-4 w-4" /> Gerenciar
//             </DropdownMenuItem>
//           )}

//           {/* Ação para Publicar (apenas para sistemas gerenciados e não publicados) */}
//           {data.managed && !data.published && (
//             <DropdownMenuItem
//               onClick={() => router.push(`/dashboard/request-detail/`)}
//             >
//               <FileKey2 className="mr-2 h-4 w-4" /> Publicar
//             </DropdownMenuItem>
//           )}

//           {/* Ação para Despublicar (apenas para sistemas gerenciados e publicados) */}
//           {data.managed && data.published && (
//             <DropdownMenuItem
//               onClick={() => router.push(`/dashboard/request-detail/`)}
//             >
//               <FileKey className="mr-2 h-4 w-4" /> Despublicar
//             </DropdownMenuItem>
//           )}
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </>
//   );
// };


'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Cog, Eye, FileKey, FileKey2, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CellActionProps {
  data: {
    id: number;
    name: string;
    description: string;
    status: string;
    managed: boolean;
    published: boolean;
  };
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {};

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/request-detail/`)}
          >
            <Eye className="mr-2 h-4 w-4" /> Detalhar
          </DropdownMenuItem>

          {!data.managed && (
            <DropdownMenuItem
              onClick={() => router.push(`/dashboard/request-detail/`)}
            >
              <Cog className="mr-2 h-4 w-4" /> Gerenciar
            </DropdownMenuItem>
          )}

          {data.managed && !data.published && (
            <DropdownMenuItem
              onClick={() => router.push(`/dashboard/request-detail/`)}
            >
              <FileKey2 className="mr-2 h-4 w-4" /> Publicar
            </DropdownMenuItem>
          )}

          {data.managed && data.published && (
            <DropdownMenuItem
              onClick={() => router.push(`/dashboard/request-detail/`)}
            >
              <FileKey className="mr-2 h-4 w-4" /> Despublicar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
