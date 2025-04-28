import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable
} from "@tanstack/react-table";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "../../../../../components/ui/button.tsx";
import { Input } from "../../../../../components/ui/input.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select.tsx";
import { ArrowLeft, ArrowRight, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { ScrollArea, ScrollBar } from "../../../../../components/ui/scroll-area.tsx";

import { Card, CardContent } from "../../../../../components/ui/card.tsx";
import { useMediaQuery } from "../../../../../common/hooks/use-media-query.ts";
import HighlightLoader from "../../../../../components/highlightloader/HighLightLoader.tsx";

export function RequestsTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pageSizeOptions = [10, 20, 30, 40, 50],
  onPageChange
}: {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageNo: number;
  totalUsers: number;
  pageCount: number;
  pageSizeOptions?: number[];
  onPageChange: (pageIndex: number, pageSize: number, filter: string) => void;
}) {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const [isLoading, setIsLoading] = useState(true);

  const page = searchParams?.get("page") ?? "1";
  const pageAsNumber = Number(page);
  const fallbackPage = isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
  const per_page = searchParams?.get("limit") ?? "10";
  const perPageAsNumber = Number(per_page);
  const fallbackPerPage = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: fallbackPage - 1,
    pageSize: fallbackPerPage
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    state: { pagination: { pageIndex, pageSize } },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    onPaginationChange: (updater) => {
      setPagination((old) => {
        const newPaginationValue = updater instanceof Function ? updater(old) : updater;
        onPageChange?.(newPaginationValue.pageIndex + 1, newPaginationValue.pageSize, "");
        return newPaginationValue;
      });
    }
  });

  const isMobile = useMediaQuery("(max-width: 768px)");

  const skipFirstFilterRef = useRef(true);
  const [filter, setFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState(filter);

  useEffect(() => {
    const timeoutHandler = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 300);

    return () => {
      clearTimeout(timeoutHandler);
    };
  }, [filter]);

  useEffect(() => {
    if (skipFirstFilterRef.current) {
      skipFirstFilterRef.current = false;
      return;
    }

    setPagination((prev) => ({ ...prev, pageIndex: 0 }));

    if(onPageChange) {
      onPageChange(1, table.getState().pagination.pageSize, filter);
    }
  }, [debouncedFilter]);

  return (
    <>
      <div className="flex gap-4 pt-1 pb-2">
        <Input
          placeholder="Filtrar por Sistema..."
          className="w-full md:max-w-sm"
          value={filter}
          onChange={(e) => { setFilter(e.target.value) }}/>
      </div>

      {isMobile ? (
        <div className="space-y-4">
          {table.getRowModel().rows.map((row) => (
            <Card key={row.id}>
              <CardContent className="p-4">
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id} className="mb-2">
                    <strong>{cell.column.columnDef.header as React.ReactNode}: </strong>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <ScrollArea className="rounded-md border">
          {isLoading ? (
            <div className="grid justify-center items-center h-[calc(80vh-240px)]">
              {/* <ShuffleLoader /> */}
              <HighlightLoader />
            </div>
          ) : (
            <Table className="relative">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead className="uppercase" key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
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
          )}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}

      <div className="flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:flex-row">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <p className="whitespace-nowrap text-sm font-medium">
                Linhas por página
              </p>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={String(pageSize)} />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-2 sm:justify-end">
          <div className="flex w-[110px] items-center justify-center text-sm font-medium">
            Página {pageIndex + 1} de {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              aria-label="Primeira página"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Página anterior"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Próxima página"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Última página"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

