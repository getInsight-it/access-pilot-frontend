import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { RoleResponseInterface } from "../../../features/role/common/types/role.model.ts";

export const columns = (): ColumnDef<RoleResponseInterface>[] => [
  {
    accessorKey: "name",
    header: "NOME DO PAPEL"
  },
  {
    accessorKey: "roleParent.name",
    header: "PAPEL PAI",
    cell: ({ row }) => (
      <span>
        {row.original.roleParent?.name?.trim() ? row.original.roleParent?.name : "-"}
      </span>
    )
  },
  {
    accessorKey: "description",
    header: "DESCRIÇÃO",
    cell: ({ row }) => (
      <span>
        {row.original.description?.trim() ? row.original.description : "-"}
      </span>
    )
  },
  {
    accessorKey: "level.name",
    header: "ESFERA",
    cell: ({ row }) => (
      <span>
         {row.original.level?.name?.trim() ? row.original.level?.name : "-"}
      </span>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
