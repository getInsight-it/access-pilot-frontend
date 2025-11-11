import { useEffect, useState } from "react";
import { Button } from "@ui/button.tsx";
import { ChevronDown, ChevronRight, User } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@ui/table.tsx";
import { Badge } from "@ui/badge.tsx";
import { RoleResponseInterface } from "@features/role/common/types/role.model";

interface RoleItemType {
  id: string;
  name: string;
  children?: RoleItemType[];
  roleParent?: {
    id: string;
    name: string;
  } | null;
  level?: number;
}

interface ClientRoleDetailsProps {
  roles: RoleResponseInterface[];
}

export const ClientRoleDetails = ({ roles }: ClientRoleDetailsProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [roleItems, setRoleItems] = useState<RoleItemType[]>([]);
  const [flatRoles, setFlatRoles] = useState<RoleItemType[]>([]);

  useEffect(() => {
    const treeStructure = buildTreeStructure(roles);
    setRoleItems(treeStructure);

    const flatList = flattenRoles(treeStructure, 0);
    setFlatRoles(flatList);
  }, [roles]);

  const buildTreeStructure = (items: RoleResponseInterface[]): RoleItemType[] => {
    const itemMap = new Map<string, RoleItemType>();

    items.forEach((item) => {
      const id = item.id.toString();
      itemMap.set(id, {
        id,
        name: item.name,
        roleParent: item.roleParent ? { id: item.roleParent.id.toString(), name: item.roleParent.name } : null,
        children: []
      });
    });

    const rootItems: RoleItemType[] = [];

    items.forEach((item) => {
      const id = item.id?.toString() || "";
      const roleItem = itemMap.get(id);

      if(!roleItem) return;
      if(!item.roleParent) {
        rootItems.push(roleItem);
      } else if(item.roleParent?.id) {
        const parentId = item.roleParent.id.toString();
        const parent = itemMap.get(parentId);

        if(parent) {
          parent.children = parent.children || [];
          parent.children.push(roleItem);
        } else {
          rootItems.push(roleItem);
        }
      } else {
        rootItems.push(roleItem);
      }
    });

    const sortItems = (items: RoleItemType[]): RoleItemType[] => {
      return items
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((item) => ({
          ...item,
          children: item.children && item.children.length > 0
            ? sortItems(item.children)
            : []
        }));
    };

    return sortItems(rootItems);
  };

  const flattenRoles = (items: RoleItemType[], level: number = 0): RoleItemType[] => {
    let result: RoleItemType[] = [];

    items.forEach((item) => {
      const itemWithLevel = { ...item, level };
      result.push(itemWithLevel);

      if(item.children && item.children.length > 0 && expandedItems.has(item.id)) {
        result = result.concat(flattenRoles(item.children, level + 1));
      }
    });

    return result;
  };

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if(next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  useEffect(() => {
    if(roleItems.length > 0) {
      const flatList = flattenRoles(roleItems, 0);
      setFlatRoles(flatList);
    }
  }, [expandedItems, roleItems]);

  if(roleItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-center text-gray-500 dark:text-gray-400">Nenhum papel cadastrado para este sistema.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full">
        <Table>
          <TableBody>
            {flatRoles && flatRoles.map((item) => (
              <TableRow key={item.id}>
                <TableCell width="100%">
                  <div className="flex items-center" style={{ paddingLeft: `${(item.level || 0) * 20}px` }}>
                    <div className="w-8 mr-2 flex justify-center">
                      {item.children && item.children.length > 0 ? (
                        <Button variant="ghost" size="icon" onClick={() => toggleExpand(item.id)} className="h-6 w-6">
                          {expandedItems.has(item.id) ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </Button>
                      ) : null}
                    </div>
                    <div
                      className="h-8 w-8 flex items-center justify-center border border-gray-200 rounded-lg mr-3 shadow-xs-skeumorphic bg-white dark:bg-gray-800 dark:border-gray-700">
                      <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">{item.name}</span>
                      {item.children && item.children.length > 0 && (
                        <Badge variant="outline" size="sm">
                          {item.children.length}
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
