import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable
} from '@tanstack/react-table';
import React from 'react';

import {Button} from '../../../components/ui/button';
import {Input} from '../../../components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../../../components/ui/select';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '../../../components/ui/table';
import {ArrowLeft, ArrowRight, ChevronLeftIcon, ChevronRightIcon} from 'lucide-react';
import {useLocation, useNavigate} from 'react-router-dom';
import {ScrollArea, ScrollBar} from '../../../components/ui/scroll-area';
import Legenda from '../../Legenda';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[],
  data: TData[],
  searchKey: string,
  pageNo: number,
  totalUsers: number,
  pageSizeOptions?: number[],
  pageCount: number,
  searchParams?: {
    [key: string]: string | string[] | undefined;
  },
  onPageChange?: (pageIndex, pageSize) => void
}

export function SystemsTable<TData, TValue>({
                                              columns,
                                              data,
                                              pageNo,
                                              searchKey,
                                              totalUsers,
                                              pageCount,
                                              pageSizeOptions = [10, 20, 30, 40, 50],
                                              onPageChange
                                            }: DataTableProps<TData, TValue>) {
  const navigate = useNavigate();
  const {search, pathname} = useLocation();
  const searchParams = new URLSearchParams(search);

  // Search params
  const page = searchParams?.get('page') ?? '1';
  const pageAsNumber = Number(page);
  const fallbackPage = isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
  const per_page =  Math.ceil(Number(searchParams?.get('limit') ?? 10) / totalUsers);
  const perPageAsNumber = pageSizeOptions.filter(o => o >= per_page)[0] ?? 10;
  const fallbackPerPage = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;

  /* this can be used to get the selectedrows
  console.log("value", table.getFilteredSelectedRowModel()); */

  // Create query string
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(search);
      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }
      return newSearchParams.toString();
    },
    [search]
  );

  const [{pageIndex, pageSize}, setPagination] = React.useState<PaginationState>({
    pageIndex: fallbackPage - 1,
    pageSize: fallbackPerPage
  });


  React.useEffect(() => {
    navigate(
      `${pathname}?${createQueryString({
        page: pageIndex + 1,
        limit: pageSize
      })}`,
      {replace: true}
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize]);

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination: {pageIndex, pageSize}
    },
    onPaginationChange: (updater) => {
      setPagination(old => {
          const newPaginationValue = updater instanceof Function ? updater(old) : updater;
          if ('pageIndex' in newPaginationValue) {
            onPageChange?.(newPaginationValue?.pageIndex, newPaginationValue?.pageSize);
            return newPaginationValue;
          }
        }
      );
    },
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true
  });

  const searchValue = table.getColumn(searchKey)?.getFilterValue() as string;

  React.useEffect(() => {
    if (searchValue?.length > 0) {
      navigate(
        `${pathname}?${createQueryString({
          page: null,
          limit: null,
          search: searchValue
        })}`,
        {replace: true}
      );
    }
    if (searchValue?.length === 0 || searchValue === undefined) {
      navigate(
        `${pathname}?${createQueryString({
          page: null,
          limit: null,
          search: null
        })}`,
        {replace: true}
      );
    }

    setPagination((prev) => ({...prev, pageIndex: 0}));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <>
      <div className="flex flex-col items-end lg:flex-row lg:items-center justify-between gap-4 pt-1 pb-2">
    
        <Input
          placeholder={`Pesquisar ${searchKey}...`}
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="w-full md:max-w-sm"
        />
        <div className="text-right">
          
          <Legenda />
        </div>
      </div>

      <ScrollArea className="h-[calc(80vh-220px)] rounded-md border">
        <Table className="relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal"/>
      </ScrollArea>

      <div className="flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:flex-row">
        <div className="flex w-full items-center justify-between">
          
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <p className="whitespace-nowrap text-sm font-medium">
                Linhas por página
              </p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-2 sm:justify-end">
          <div className="flex w-[110px] items-center justify-center text-sm font-medium">
            Página {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              aria-label="Go to first page"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true"/>
            </Button>
            <Button
              aria-label="Go to previous page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true"/>
            </Button>
            <Button
              aria-label="Go to next page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true"/>
            </Button>
            <Button
              aria-label="Go to last page"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true"/>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}


// import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
// import { Button } from "../../ui/button"
// import { Input } from "../../ui/input"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
// import { ScrollArea } from "../../ui/scroll-area"

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[]
//   data: TData[]
//   searchKey: string
//   pageNo: number
//   totalUsers: number
//   pageSizeOptions?: number[]
//   pageCount: number
//   onPageChange: (page: number) => void
//   onSearchChange: (search: string) => void
//   search: string
//   searchLength: number
//   currentPage: number
//   isLoading: boolean
//   isTimeout: boolean
//   error: string | null
//   pageSize: number
// }

// export function SystemsTable<TData, TValue>({
//   columns,
//   data,
//   pageNo,
//   searchKey,
//   totalUsers,
//   pageCount,
//   pageSizeOptions = [10, 20, 30, 40, 50],
//   onPageChange,
//   onSearchChange,
//   search,
//   searchLength,
//   currentPage,
//   isLoading,
//   isTimeout,
//   error,
//   pageSize,
// }: DataTableProps<TData, TValue>) {
//   const table = useReactTable({
//     data,
//     columns,
//     pageCount: pageCount,
//     state: {
//       pagination: {
//         pageIndex: currentPage - 1,
//         pageSize: pageSize,
//       },
//     },
//     onPaginationChange: (updater) => {
//       if (typeof updater === "function") {
//         const newPagination = updater({ pageIndex: currentPage - 1, pageSize: pageSize })
//         onPageChange(newPagination.pageIndex + 1)
//       } else {
//         onPageChange(updater.pageIndex + 1)
//       }
//     },
//     getCoreRowModel: getCoreRowModel(),
//     manualPagination: true,
//     debugTable: true,
//   })

//   return (
//     <div>
//       <div className="flex items-center py-4">
//         <Input
//           placeholder={`Pesquisar ${searchKey}...`}
//           value={search}
//           onChange={(event) => onSearchChange(event.target.value)}
//           className="max-w-sm"
//         />
//       </div>
//       <div className="rounded-md border">
//         <ScrollArea className="h-[calc(80vh-220px)]">
//           <Table>
//             <TableHeader>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <TableRow key={headerGroup.id}>
//                   {headerGroup.headers.map((header) => (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
//                     </TableHead>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableHeader>
//             <TableBody>
//               {isLoading ? (
//                 <TableRow>
//                   <TableCell colSpan={columns.length} className="h-24 text-center">
//                     Carregando...
//                   </TableCell>
//                 </TableRow>
//               ) : data.length > 0 ? (
//                 table.getRowModel().rows.map((row) => (
//                   <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
//                     {row.getVisibleCells().map((cell) => (
//                       <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
//                     ))}
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={columns.length} className="h-24 text-center">
//                     Nenhum resultado.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </ScrollArea>
//       </div>
//       <div className="flex items-center justify-between space-x-2 py-4">
//         <div className="flex-1 text-sm text-muted-foreground">{totalUsers} item(s) no total</div>
//         <div className="flex items-center space-x-6 lg:space-x-8">
//           <div className="flex items-center space-x-2">
//             <p className="text-sm font-medium">
//               Página {currentPage} de {pageCount}
//             </p>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => onPageChange(currentPage - 1)}
//               disabled={currentPage === 1 || isLoading}
//             >
//               Anterior
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => onPageChange(currentPage + 1)}
//               disabled={currentPage === pageCount || isLoading}
//             >
//               Próxima
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }





