import { ClientResponseInterface } from "../../../../client/common/model/client.model.ts";
import { ChevronDown, ChevronRight, Eye, LaptopMinimal, Plus, SquareArrowOutUpRight } from "lucide-react";
import { MouseEvent, useMemo, useState } from "react";
import { Button } from "../../../../../common/external/ui/button.tsx";
import { useI18n } from "../../../../../common/context/i18n/I18nContext.tsx";
import "./client-card.scss";

interface ClientCardProps {
  client: ClientResponseInterface;
  hasAccess: boolean;
  onActionClick?: () => void;
}

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

    const currentItems = target.items ?? [];
    const incomingItems = incoming.items ?? [];

    if (!currentItems.length && !incomingItems.length) {
      target.items = [];
      return;
    }

    const mergedChildren = new Map<number, NodeType>();

    [...currentItems, ...incomingItems].forEach((child) => {
      const existingChild = mergedChildren.get(child.id);

      if (!existingChild) {
        mergedChildren.set(child.id, { ...child, items: child.items ? [...child.items] : [] });
        return;
      }

      merge(existingChild, child);
    });

    target.items = Array.from(mergedChildren.values()).map((node) => ({
      ...node,
      items: node.items ? mergeNodeListsById(node.items) : []
    }));
  };

  nodes.forEach((node) => {
    const existingNode = byId.get(node.id);

    if (!existingNode) {
      byId.set(node.id, { ...node, items: node.items ? [...node.items] : [] });
      return;
    }

    merge(existingNode, node);
  });

  return Array.from(byId.values());
}

const TreeNode = ({ node, depth = 0 }: { node: NodeType; depth?: number }) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(true);
  const hasChildren = (node.items?.length ?? 0) > 0;

  return (
    <div className={`client-card__tree-node client-card__tree-node--level-${Math.min(depth, 6)}`}>
      <div className="client-card__tree-node-row">
        {hasChildren ? (
          <button
            type="button"
            className="client-card__tree-toggle"
            onClick={() => setOpen((previous) => !previous)}
            aria-label={open ? t("Recolher itens") : t("Expandir itens")}
          >
            {open ? <ChevronDown className="client-card__tree-toggle-icon" /> : <ChevronRight className="client-card__tree-toggle-icon" />}
          </button>
        ) : (
          <span className="client-card__tree-toggle-placeholder" />
        )}

        <span className="client-card__tree-node-name">{node.name}</span>

        {node.level && (
          <span className="client-card__tree-node-level">{node.level.name}</span>
        )}
      </div>

      {hasChildren && open && (
        <div className="client-card__tree-children">
          {node.items?.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const RolesTree = ({ allowedItemsHierarchy }: { allowedItemsHierarchy: ItemTreeInterface[] }) => {
  const { t } = useI18n();
  const nodes = allowedItemsHierarchy as unknown as NodeType[];

  const roleEntries = useMemo(() => {
    const byRole = new Map<number, { role: RoleType; roots: NodeType[] }>();

    nodes.forEach((root) => {
      const role = root.role;
      const roleId = role?.id ?? -1;

      if (!byRole.has(roleId)) {
        byRole.set(roleId, {
          role: role ?? { id: -1, name: t("Sem papel") },
          roots: []
        });
      }

      byRole.get(roleId)?.roots.push(root);
    });

    return Array.from(byRole.values()).sort((left, right) => left.role.name.localeCompare(right.role.name));
  }, [nodes, t]);

  const [activeRoleId, setActiveRoleId] = useState(roleEntries[0]?.role.id ?? -1);

  const activeRoots = useMemo(() => {
    const activeEntry = roleEntries.find((entry) => entry.role.id === activeRoleId) ?? roleEntries[0];
    return mergeNodeListsById(activeEntry?.roots ?? []);
  }, [activeRoleId, roleEntries]);

  if (!roleEntries.length) {
    return null;
  }

  return (
    <div className="client-card__tree">
      <div className="client-card__tree-tabs">
        {roleEntries.map(({ role }) => {
          const isActive = role.id === activeRoleId;

          return (
            <button
              key={role.id}
              type="button"
              className={`client-card__tree-tab${isActive ? " client-card__tree-tab--active" : ""}`}
              onClick={() => setActiveRoleId(role.id)}
            >
              {role.name}
            </button>
          );
        })}
      </div>

      <div className="client-card__tree-panel">
        {activeRoots.map((root) => (
          <TreeNode key={root.id} node={root} />
        ))}
      </div>
    </div>
  );
};

export const ClientCard = ({ client, hasAccess, onActionClick }: ClientCardProps) => {
  const { t } = useI18n();
  const [showHierarchy, setShowHierarchy] = useState(false);
  const hierarchyCount = client.allowedItemsHierarchy?.length || 0;
  const configurationCount = client.configurations?.length || 0;

  const toggleHierarchy = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowHierarchy((previous) => !previous);
  };

  const handleActionClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onActionClick?.();
  };

  return (
    <article className={`client-card${hasAccess ? " client-card--attached" : " client-card--detached"}${showHierarchy ? " client-card--expanded" : ""}`}>
      <div className="client-card__header">
        <div className="client-card__identity">
          <div className="client-card__icon-box">
            <LaptopMinimal className="client-card__icon" />
          </div>

          <div className="client-card__heading">
            <div className="client-card__title-block">
              <span className="client-card__title">{client.name}</span>
              <span className={`client-card__state${hasAccess ? " client-card__state--attached" : " client-card__state--detached"}`}>
                {hasAccess ? t("Com acesso") : t("Disponível")}
              </span>
            </div>
          </div>
        </div>

        <div className="client-card__actions">
          {hasAccess && hierarchyCount > 0 && (
            <div className="client-card__actions-group">
              <Button variant="white" className="client-card__action-button client-card__action-button--icon" onClick={toggleHierarchy}>
                <Eye className="client-card__secondary-action-icon" />
              </Button>
              <Button variant="white" className="client-card__action-button" onClick={handleActionClick}>
                <SquareArrowOutUpRight className="client-card__action-icon" />
                <span>{t("Ver detalhes")}</span>
              </Button>
            </div>
          )}

          {hasAccess ? null : (
            <Button variant="default" className="theme-button--primary client-card__action-button client-card__action-button--primary" onClick={handleActionClick}>
              <Plus className="client-card__action-icon" />
              <span>{t("Solicitar acesso")}</span>
            </Button>
          )}
        </div>
      </div>

      <div className="client-card__body">
        <p className="client-card__description">
          {client.description || t("Sem descrição disponível para este sistema.")}
        </p>
      </div>

      <div className="client-card__meta-grid">
        <div className="client-card__meta-item">
          <span className="client-card__meta-label">{t("Client Id")}</span>
          <span className="client-card__meta-value">{client.clientId || "-"}</span>
        </div>

        <div className="client-card__meta-item">
          <span className="client-card__meta-label">{hasAccess ? t("Permissões") : t("Anexos exigidos")}</span>
          <span className="client-card__meta-value">{hasAccess ? hierarchyCount : configurationCount}</span>
        </div>
      </div>

      {showHierarchy && hierarchyCount > 0 && (
        <div className="client-card__hierarchy">
          <RolesTree allowedItemsHierarchy={client.allowedItemsHierarchy} />
        </div>
      )}
    </article>
  );
};
