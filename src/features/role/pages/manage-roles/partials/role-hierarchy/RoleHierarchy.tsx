import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Tree, NodeRendererProps } from "react-arborist";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeProps as FlowNodeProps
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "@dagrejs/dagre";
import { catchError, finalize, from, tap } from "rxjs";
import { toast } from "../../../../../../common/external/ui/use-toast.ts";
import { Button } from "../../../../../../common/external/ui/button.tsx";
import { Badge } from "../../../../../../common/external/ui/badge.tsx";
import IconRenderer from "../../../../../../common/components/icon/IconRenderer.tsx";
import { ChevronDown, ChevronRight, User, Users } from "lucide-react";
import { StepLoader } from "../../../../../../common/components/loading/StepLoader.tsx";
import { roleService } from "../../../../common/service/role-service.ts";
import { RoleResponseInterface } from "../../../../common/types/role.model.ts";
import { formatErrorMessages } from "../../../../../../common/utils/error-utils.ts";
import { ArboristNode, RoleHierarchyProps, RoleUpdatePayload } from "../../../../common/types/role-hierarchy.model.ts";
import { useI18n } from "../../../../../../common/context/i18n/I18nContext.tsx";
import "./role-hierarchy.scss";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const TREE_FALLBACK_HEIGHT = 420;
const TREE_FALLBACK_ROW_HEIGHT = 38;
const TREE_FALLBACK_INDENT = 20;
const FLOW_NODE_FALLBACK_MIN_WIDTH = 160;
const FLOW_NODE_FALLBACK_MAX_WIDTH = 280;
const FLOW_NODE_FALLBACK_MIN_HEIGHT = 56;
const FLOW_NODE_FALLBACK_PADDING_INLINE = 16;
const FLOW_NODE_FALLBACK_PADDING_BLOCK = 12;
const FLOW_NODE_MAX_LINES = 2;

type RoleFlowNodeData = {
  label: string;
};

type RoleFlowNode = Node<RoleFlowNodeData, "role-node">;

function getThemeSizeToken(token: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const rawValue = window.getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const parsed = Number.parseFloat(rawValue);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getThemeStringToken(token: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const rawValue = window.getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  return rawValue || fallback;
}

function getThemeLineHeightToken(token: string, fontSize: number, fallbackMultiplier: number): number {
  if (typeof window === "undefined") return fontSize * fallbackMultiplier;
  const rawValue = window.getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const parsed = Number.parseFloat(rawValue);

  if (!Number.isFinite(parsed)) {
    return fontSize * fallbackMultiplier;
  }

  if (rawValue.endsWith("px") || parsed > 4) {
    return parsed;
  }

  return fontSize * parsed;
}

function measureTextWidth(label: string, fontSize: number, fontWeight: string, fontFamily: string): number {
  if (typeof document === "undefined") {
    return label.length * fontSize * 0.56;
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return label.length * fontSize * 0.56;
  }

  context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  return context.measureText(label).width;
}

function getFlowNodeSize(label: string): { width: number; height: number } {
  const minWidth = getThemeSizeToken("--role-hierarchy-flow-node-min-width", FLOW_NODE_FALLBACK_MIN_WIDTH);
  const maxWidth = Math.max(minWidth, getThemeSizeToken("--role-hierarchy-flow-node-max-width", FLOW_NODE_FALLBACK_MAX_WIDTH));
  const minHeight = getThemeSizeToken("--role-hierarchy-flow-node-min-height", FLOW_NODE_FALLBACK_MIN_HEIGHT);
  const paddingInline = getThemeSizeToken("--role-hierarchy-flow-node-padding-inline", FLOW_NODE_FALLBACK_PADDING_INLINE);
  const paddingBlock = getThemeSizeToken("--role-hierarchy-flow-node-padding-block", FLOW_NODE_FALLBACK_PADDING_BLOCK);
  const fontSize = getThemeSizeToken("--typography-body-md-font-size", 14);
  const fontWeight = getThemeStringToken("--typography-body-md-font-weight", "400");
  const fontFamily = getThemeStringToken("--font-family", "sans-serif");
  const lineHeight = getThemeLineHeightToken("--typography-body-md-line-height", fontSize, 1.45);
  const measuredTextWidth = measureTextWidth(label, fontSize, fontWeight, fontFamily);
  const width = Math.min(maxWidth, Math.max(minWidth, measuredTextWidth + paddingInline * 2));
  const availableTextWidth = Math.max(width - paddingInline * 2, fontSize);
  const lineCount = Math.min(FLOW_NODE_MAX_LINES, Math.max(1, Math.ceil(measuredTextWidth / availableTextWidth)));
  const height = Math.max(minHeight, Math.ceil(lineCount * lineHeight + paddingBlock * 2));

  return {
    width: Math.ceil(width),
    height: Math.ceil(height)
  };
}

function RoleHierarchyFlowNode({ data }: Readonly<FlowNodeProps<RoleFlowNode>>) {
  return (
    <div className="role-hierarchy__flow-node" title={data.label}>
      <Handle
        type="target"
        position={Position.Top}
        className="role-hierarchy__flow-handle role-hierarchy__flow-handle--target"
        isConnectable={false}
      />
      <span className="role-hierarchy__flow-node-label">{data.label}</span>
      <Handle
        type="source"
        position={Position.Bottom}
        className="role-hierarchy__flow-handle role-hierarchy__flow-handle--source"
        isConnectable={false}
      />
    </div>
  );
}

const roleHierarchyNodeTypes = {
  "role-node": RoleHierarchyFlowNode
};

function buildArboristTree(data: RoleResponseInterface[]): ArboristNode[] {
  const nodeMap = new Map<number, ArboristNode>();

  data.forEach(role => {
    nodeMap.set(role.id, {
      id: role.id.toString(),
      name: role.name,
      levelName: role.level?.name || role.level?.sigla || "",
      icon: role.icon,
      color: role.color,
      children: []
    });
  });

  const roots: ArboristNode[] = [];

  data.forEach(role => {
    const node = nodeMap.get(role.id)!;
    if (role.roleParent?.id && nodeMap.has(role.roleParent.id)) {
      const parent = nodeMap.get(role.roleParent.id)!;
      parent.children = parent.children ?? [];
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

function arboristTreeToPayload(nodes: ArboristNode[], clientId: number, parentId?: number): RoleUpdatePayload[] {
  const result: RoleUpdatePayload[] = [];
  for (const node of nodes) {
    result.push({ id: parseInt(node.id), parentId, clientId });
    if (node.children?.length) {
      result.push(...arboristTreeToPayload(node.children, clientId, parseInt(node.id)));
    }
  }
  return result;
}

function arboristTreeToFlowElements(nodes: ArboristNode[]): { nodes: RoleFlowNode[]; edges: Edge[] } {
  dagreGraph.nodes().forEach(n => dagreGraph.removeNode(n));
  dagreGraph.setGraph({ rankdir: "TB" });

  const flowNodes: RoleFlowNode[] = [];
  const flowEdges: Edge[] = [];

  function flatten(nodeList: ArboristNode[], parentId?: string) {
    for (const node of nodeList) {
      const nodeSize = getFlowNodeSize(node.name);
      dagreGraph.setNode(node.id, { width: nodeSize.width, height: nodeSize.height });
      flowNodes.push({
        id: node.id,
        type: "role-node",
        className: "role-hierarchy__flow-node-wrapper",
        data: { label: node.name },
        position: { x: 0, y: 0 },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
        style: {
          width: nodeSize.width,
          height: nodeSize.height
        }
      });
      if (parentId) {
        dagreGraph.setEdge(parentId, node.id);
        flowEdges.push({
          id: `e-${parentId}-${node.id}`,
          source: parentId,
          target: node.id
        });
      }
      if (node.children?.length) {
        flatten(node.children, node.id);
      }
    }
  }

  flatten(nodes);
  dagre.layout(dagreGraph);

  flowNodes.forEach(node => {
    const dagreNode = dagreGraph.node(node.id);
    node.position = {
      x: dagreNode.x - dagreNode.width / 2,
      y: dagreNode.y - dagreNode.height / 2
    };
  });

  return { nodes: flowNodes, edges: flowEdges };
}

function NodeRenderer({ node, style, dragHandle }: NodeRendererProps<ArboristNode>) {
  const hasChildren = Boolean(node.data.children?.length);
  const indent = getThemeSizeToken("--system-detail-role-indent-size", TREE_FALLBACK_INDENT);
  const iconBoxHalf = getThemeSizeToken("--system-detail-role-icon-box-size", 24) / 2;
  const nodeStyle = node.data.color
    ? {
        ...style,
        "--role-hierarchy-node-icon-color": node.data.color
      } as CSSProperties
    : style;

  const nodeClassName = [
    "role-hierarchy__node",
    node.isSelected ? "role-hierarchy__node--selected" : "",
    node.isDragging ? "role-hierarchy__node--dragging" : "",
    node.willReceiveDrop ? "role-hierarchy__node--drop-target" : ""
  ].filter(Boolean).join(" ");

  return (
    <div
      style={nodeStyle}
      ref={dragHandle}
      className={nodeClassName}
    >
      {node.level > 0 && Array.from({ length: node.level }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="role-hierarchy__node-guide"
          style={{ left: i * indent + iconBoxHalf }}
        />
      ))}

      {hasChildren ? (
        <button
          type="button"
          className="role-hierarchy__node-toggle"
          onClick={e => { e.stopPropagation(); node.toggle(); }}
        >
          {node.isOpen
            ? <ChevronDown className="role-hierarchy__node-toggle-icon" />
            : <ChevronRight className="role-hierarchy__node-toggle-icon" />}
        </button>
      ) : (
        <span className="role-hierarchy__node-toggle-placeholder" />
      )}

      {node.data.icon ? (
        <IconRenderer
          iconName={node.data.icon}
          className="role-hierarchy__node-icon role-hierarchy__node-icon--role"
          color={node.data.color}
        />
      ) : hasChildren
        ? <Users className="role-hierarchy__node-icon role-hierarchy__node-icon--group" />
        : <User className="role-hierarchy__node-icon role-hierarchy__node-icon--single" />}

      <span className="role-hierarchy__node-name" title={node.data.name}>
        {node.data.name}
      </span>

      {node.data.levelName && (
        <Badge variant="outline" className="role-hierarchy__node-level">
          {node.data.levelName}
        </Badge>
      )}
    </div>
  );
}

function RoleHierarchy({ data, onSuccess }: Readonly<RoleHierarchyProps>) {
  const { t } = useI18n();
  const [treeData, setTreeData] = useState<ArboristNode[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<RoleFlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(false);
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const [treeHeight, setTreeHeight] = useState(0);
  const [treeWidth, setTreeWidth] = useState(0);
  const [treeRowHeight, setTreeRowHeight] = useState(TREE_FALLBACK_ROW_HEIGHT);
  const [treeIndent, setTreeIndent] = useState(TREE_FALLBACK_INDENT);

  useEffect(() => {
    const el = treeContainerRef.current;
    if (!el) return;

    const updateMetrics = () => {
      setTreeWidth(el.clientWidth);
      setTreeHeight(el.clientHeight);
      setTreeRowHeight(getThemeSizeToken("--input-height", TREE_FALLBACK_ROW_HEIGHT));
      setTreeIndent(getThemeSizeToken("--system-detail-role-indent-size", TREE_FALLBACK_INDENT));
    };

    const observer = new ResizeObserver(updateMetrics);
    observer.observe(el);
    updateMetrics();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (data?.length) {
      setTreeData(buildArboristTree(data));
    }
  }, [data]);

  useEffect(() => {
    if (treeData.length > 0) {
      const { nodes: fn, edges: fe } = arboristTreeToFlowElements(treeData);
      setNodes(fn as any);
      setEdges(fe as any);
    }
  }, [treeData, setNodes, setEdges]);

  const handleMove = ({ dragIds, parentId, index }: { dragIds: string[]; parentId: string | null; index: number }) => {
    setTreeData(prev => {
      const newTree: ArboristNode[] = JSON.parse(JSON.stringify(prev));
      const dragged: ArboristNode[] = [];

      function removeNodes(nodeList: ArboristNode[]): ArboristNode[] {
        return nodeList.filter(node => {
          if (dragIds.includes(node.id)) {
            dragged.push(node);
            return false;
          }
          if (node.children) {
            node.children = removeNodes(node.children);
          }
          return true;
        });
      }

      const treeWithout = removeNodes(newTree);

      function insertNodes(nodeList: ArboristNode[], targetParentId: string | null, idx: number): boolean {
        if (targetParentId === null) {
          nodeList.splice(idx, 0, ...dragged);
          return true;
        }
        for (const node of nodeList) {
          if (node.id === targetParentId) {
            if (!node.children) node.children = [];
            node.children.splice(idx, 0, ...dragged);
            return true;
          }
          if (node.children && insertNodes(node.children, targetParentId, idx)) {
            return true;
          }
        }
        return false;
      }

      insertNodes(treeWithout, parentId, index);
      return treeWithout;
    });
  };

  const handleSave = () => {
    if (!data?.[0]?.client?.id) {
      toast({
        title: t("Erro"),
        description: t("Dados inválidos para atualização"),
        variant: "destructive"
      });
      return;
    }

    const clientId = data[0].client.id;
    const rolePayload: RoleUpdatePayload[] = arboristTreeToPayload(treeData, clientId);

    setLoading(true);
    from(roleService.update(rolePayload as unknown as RoleResponseInterface[])).pipe(
      tap(() => {
        toast({
          title: t("Papéis atualizados"),
          description: t("Os papéis foram atualizados com sucesso")
        });
        onSuccess?.();
      }),
      catchError((error: unknown) => {
        const errorMessage: string = formatErrorMessages(error);
        toast({
          title: t("Erro ao atualizar papéis"),
          description: errorMessage,
          variant: "destructive"
        });
        return [];
      }),
      finalize(() => setLoading(false))
    ).subscribe();
  };

  return (
    <>
      <div className="role-hierarchy">
        <div className="role-hierarchy__panel role-hierarchy__panel--editor">
          <div className="role-hierarchy__panel-header">
            <h3 className="role-hierarchy__panel-title">{t("Organização de papéis")}</h3>
            <p className="role-hierarchy__panel-description">{t("Arraste os nós para redefinir a estrutura hierárquica.")}</p>
          </div>

          <div className="role-hierarchy__tree-surface" ref={treeContainerRef}>
            <Tree<ArboristNode>
              className="role-hierarchy__tree"
              data={treeData}
              onMove={handleMove}
              openByDefault={true}
              width={treeWidth || undefined}
              height={treeHeight || TREE_FALLBACK_HEIGHT}
              rowHeight={treeRowHeight}
              indent={treeIndent}
            >
              {NodeRenderer}
            </Tree>
          </div>

          <div className="role-hierarchy__panel-footer">
            <Button onClick={handleSave} className="theme-button--primary role-hierarchy__save-button">
              {t("Salvar hierarquia")}
            </Button>
          </div>
        </div>

        <div className="role-hierarchy__divider" />

        <div className="role-hierarchy__panel role-hierarchy__panel--preview">
          <div className="role-hierarchy__panel-header">
            <h3 className="role-hierarchy__panel-title">{t("Visualização")}</h3>
          </div>

          <div className="role-hierarchy__flow-surface">
          <ReactFlow
            className="role-hierarchy__flow"
            nodes={nodes}
            edges={edges}
            nodeTypes={roleHierarchyNodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            nodesDraggable={false}
            nodesConnectable={false}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} color="var(--table-border-color)" />
            <Controls />
          </ReactFlow>
          </div>
        </div>
      </div>

      <StepLoader loading={loading} onClose={() => setLoading(false)} />
    </>
  );
}

export default RoleHierarchy;
