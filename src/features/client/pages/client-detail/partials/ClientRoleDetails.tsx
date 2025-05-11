import { useEffect, useState } from "react";
import { Tree, TreeItem } from "../../../../../components/ui/tree.tsx";
import { Button } from "../../../../../components/ui/button.tsx";
import { ChevronDown, ChevronRight, User } from "lucide-react";
import { RoleResponseInterface } from "../../../../role/common/types/role.model.ts";

interface RoleItemType {
  id: string;
  name: string;
  children?: RoleItemType[];
  roleParent?: {
    id: string;
    name: string;
  } | null;
}

interface ClientRoleDetailsProps {
  roles: RoleResponseInterface[];
}

export const ClientRoleDetails = ({ roles }: ClientRoleDetailsProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [roleItems, setRoleItems] = useState<RoleItemType[]>([]);

  useEffect(() => {
    setRoleItems(buildTreeStructure(roles));
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

  const toggleExpand = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();

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

  const shouldShowBorder = (
    item: RoleItemType,
    index: number,
    items: RoleItemType[],
    isRootLevel: boolean,
    parentPath: string[] = []
  ): boolean => {
    if(index < items.length - 1) return true;

    if(isRootLevel) {
      return item.children !== undefined && item.children?.length > 0 && expandedItems.has(item.id);
    } else {
      const isUnderLastRoot = parentPath.length > 0
        && roleItems.length > 0
        && parentPath[0] === roleItems[roleItems.length - 1].id;
      return !isUnderLastRoot;
    }
  };

  const renderRoleTree = (
    items: RoleItemType[],
    isRootLevel = true,
    parentPath: string[] = []
  ) => {
    return (
      <Tree>
        {items.map((item, index) => {
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedItems.has(item.id);
          const currentPath = [...parentPath, item.id];
          const showBorder = shouldShowBorder(
            item,
            index,
            items,
            isRootLevel,
            parentPath
          );

          return (
            <TreeItem key={item.id}>
              <div
                className={`flex items-center justify-between w-full pr-2 transition-colors
                          hover:bg-muted/50 data-[state=selected]:bg-muted
                          ${showBorder ? "border-b border-primary/30" : ""}`}
                style={{ paddingLeft: `${parentPath.length * 20}px` }}>
                <div className="flex items-center h-16">
                  {hasChildren ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => toggleExpand(item.id, e)}>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  ) : (
                    <div className="w-8" />
                  )}

                  <User className="h-4 w-4 mr-2" />
                  <span>{item.name}</span>
                </div>
              </div>

              {hasChildren && isExpanded && (
                <div>{renderRoleTree(item.children!, false, currentPath)}</div>
              )}
            </TreeItem>
          );
        })}
      </Tree>
    );
  };

  if(roleItems.length === 0) {
    return (
      <div>
        <p className="font-bold mb-3 text-lg">Papéis do sistema:</p>
        <p className="text-center text-gray-500">Nenhum papel encontrado para este sistema.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="font-bold mb-3 text-lg">Papéis do sistema:</p>
      <div className="w-full">
        <div className="rounded-md border border-primary relative">
          <div>{renderRoleTree(roleItems)}</div>
        </div>
      </div>
    </div>
  );
};
