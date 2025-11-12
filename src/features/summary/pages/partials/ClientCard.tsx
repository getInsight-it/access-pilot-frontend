import {  ClientResponseInterface } from "../../../client/common/model/client.model.ts";
import { LaptopMinimal, Plus, SquareArrowOutUpRight, Eye } from "lucide-react";
import { useMemo, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../common/external/ui/tooltip.tsx";
import { Button } from "../../../../common/external/ui/button.tsx";
import TruncatedText from "../../../../common/components/TruncatedText.tsx";

interface ClientCardProps {
  client: ClientResponseInterface;
  hasAccess: boolean;
  onActionClick?: () => void;
}

export const ClientCard = ({ client, hasAccess, onActionClick }: ClientCardProps) => {
  const [showHierarchy, setShowHierarchy] = useState(false);

  const toggleHierarchy = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowHierarchy(!showHierarchy);
  };

  return (
    <div className="bg-white dark:bg-zebra-background-2 border border-md flex flex-col p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors w-full">
      <div className="flex flex-row items-start justify-between w-full">
        <div className="flex flex-row gap-3 items-start min-w-0 flex-1">
          <div className={`min-w-9 min-h-9 max-h-9 flex items-center justify-center ${hasAccess ? 'bg-success-100' : 'bg-warning-100'} rounded-full flex-shrink-0 mt-0.5`}>
            <LaptopMinimal size={16} className={hasAccess ? 'text-success-600' : 'text-warning-600'} />
          </div>
          <div className="flex flex-col justify-between min-w-0 flex-1">
            <span className="text-xs sm:text-sm font-medium text-text-default break-words">
              {client.name}
            </span>
            <span className="text-xs text-gray-500">
              <TruncatedText
                autoManage={true}
                maxLines={2}
                fontSize="text-xs sm:text-sm font-normal text-gray-600 dark:text-gray-400"
              />
            </span>
          </div>
        </div>

        {hasAccess ? (
          <div className="flex items-center gap-2">
            {client.allowedItemsHierarchy?.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="flex items-center gap-1 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 cursor-pointer w-fit"
                      onClick={toggleHierarchy}
                    >
                      <Eye size={14} className="inline-block" />
                      <span className="text-xs">
                        {showHierarchy ? 'Ocultar permissões' : 'Ver permissões'}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="p-2 max-w-xs">
                    <div className="text-sm">Clique para {showHierarchy ? 'ocultar' : 'ver'} a hierarquia de permissões</div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <div
              onClick={onActionClick}
              className="flex items-center justify-center border border-blue-500 rounded-md min-h-[28px] min-w-[28px] max-h-[28px] cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex-shrink-0"
            >
              <SquareArrowOutUpRight size={16} className="text-blue-500" />
            </div>
          </div>
        ) : (
          <div className="flex justify-end items-center">
            <Button variant="ghost" className="flex items-center gap-2" onClick={onActionClick}>
              <Plus size={16} className="text-blue-500" />
              <span className="text-primary-600 text-sm">Solicitar acesso</span>
            </Button>
          </div>
        )}
      </div>

      {showHierarchy && client.allowedItemsHierarchy?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="max-h-60 overflow-y-auto pr-2">
            <RolesTree allowedItemsHierarchy={client.allowedItemsHierarchy} />
          </div>
        </div>
      )}
    </div>
  );
};

type LevelType = { id: number; name: string };
type RoleType = { id: number; name: string; description?: string };

type NodeType = {
  id: number;
  name: string;
  level?: LevelType | null;
  role?: RoleType | null;
  items?: NodeType[];
};

export interface ItemTreeInterface {
  id: number;
  name: string;
  level?: LevelType | null;
  role?: RoleType | null;
  items?: ItemTreeInterface[];
}


function mergeNodeListsById(nodes: NodeType[]): NodeType[] {
  const byId = new Map<number, NodeType>();

  const merge = (target: NodeType, incoming: NodeType) => {
    target.level ??= incoming.level ?? null;
    target.role ??= incoming.role ?? null;

    const childrenA = target.items ?? [];
    const childrenB = incoming.items ?? [];
    if (!childrenA.length && !childrenB.length) {
      target.items = [];
      return;
    }
    const mergedChildren = new Map<number, NodeType>();
    for (const c of [...childrenA, ...childrenB]) {
      const existing = mergedChildren.get(c.id);
      if (!existing) {
        mergedChildren.set(c.id, { ...c, items: c.items ? [...c.items] : [] });
      } else {
        merge(existing, c);
      }
    }
    target.items = Array.from(mergedChildren.values()).map(n => ({
      ...n,
      items: n.items ? mergeNodeListsById(n.items) : [],
    }));
  };

  for (const n of nodes) {
    const existing = byId.get(n.id);
    if (!existing) {
      byId.set(n.id, { ...n, items: n.items ? [...n.items] : [] });
    } else {
      merge(existing, n);
    }
  }

  return Array.from(byId.values());
}

const TreeNode: React.FC<{ node: NodeType }> = ({ node }) => {
  const [open, setOpen] = useState(true);
  const hasChildren = (node.items?.length ?? 0) > 0;

  return (
    <div className="ml-4">
      <div className="flex items-center gap-1.5">
        {hasChildren && (
          <button
            onClick={() => setOpen(o => !o)}
            aria-label={open ? "Recolher" : "Expandir"}
            className="w-4 h-4 rounded border border-gray-300 text-[10px] flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {open ? "−" : "+"}
          </button>
        )}
        <span className="text-sm">{node.name}</span>
        {node.level && (
          <span className="text-xs md:text-[11px] text-gray-500 bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded">
            {node.level.name}
          </span>
        )}
      </div>

      {hasChildren && open && (
        <div className="mt-1">
          {node.items!.map(child => (
            <TreeNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

const RolesTree: React.FC<{ allowedItemsHierarchy: ItemTreeInterface[] }> = ({ allowedItemsHierarchy }) => {
  const nodes = allowedItemsHierarchy as unknown as NodeType[];

  const byRole = useMemo(() => {
    const map = new Map<number, { role: RoleType; roots: NodeType[] }>();
    for (const root of nodes ?? []) {
      const r = root.role;
      const roleId = r?.id ?? -1;
      if (!map.has(roleId)) {
        map.set(roleId, { role: r ?? { id: -1, name: "Sem role" }, roots: [] });
      }
      map.get(roleId)!.roots.push(root);
    }
    return map;
  }, [nodes]);

  const roleEntries = Array.from(byRole.values()).sort((a, b) =>
    a.role.name.localeCompare(b.role.name),
  );

  const [activeRoleId, setActiveRoleId] = useState<number>(
    roleEntries[0]?.role.id ?? -1,
  );

  const activeRoots = useMemo(() => {
    const entry =
      roleEntries.find(e => e.role.id === activeRoleId) ?? roleEntries[0];
    const roots = entry?.roots ?? [];
    return mergeNodeListsById(roots);
  }, [activeRoleId, roleEntries]);

  if (!roleEntries.length) return null;

  return (
    <div className="mt-1">
      {/* Abas */}
      <div className="flex gap-2 flex-wrap">
        {roleEntries.map(({ role }) => {
          const active = role.id === activeRoleId;
          return (
            <button
              key={role.id}
              onClick={() => setActiveRoleId(role.id)}
              className={[
                "px-3 py-1 rounded-full text-xs border leading-none h-6",
                active
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700",
              ].join(" ")}
            >
              {role.name}
            </button>
          );
        })}
      </div>

      <div className="mt-3 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
        {activeRoots.map(root => (
          <TreeNode key={root.id} node={root} />
        ))}
      </div>
    </div>
  );
};
