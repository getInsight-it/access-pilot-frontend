import { useEffect, useRef, useState } from "react";
import { Tree, NodeRendererProps } from "react-arborist";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  Edge
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "@dagrejs/dagre";
import { catchError, finalize, from, tap } from "rxjs";
import { toast } from "../../../../../../common/external/ui/use-toast.ts";
import { Button } from "../../../../../../common/external/ui/button.tsx";
import { Badge } from "../../../../../../common/external/ui/badge.tsx";
import { ChevronDown, ChevronRight, User, Users } from "lucide-react";
import { StepLoader } from "../../../../../../common/components/loading/StepLoader.tsx";
import { roleService } from "../../../../common/service/role-service.ts";
import { RoleResponseInterface } from "../../../../common/types/role.model.ts";
import { formatErrorMessages } from "../../../../../../common/utils/error-utils.ts";
import { ArboristNode, RoleHierarchyProps, RoleUpdatePayload } from "../../../../common/types/role-hierarchy.model.ts";
import "./role-hierarchy.scss";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const NODE_WIDTH = 160;
const NODE_HEIGHT = 40;
const TREE_FALLBACK_HEIGHT = 420;
const TREE_FALLBACK_ROW_HEIGHT = 38;
const TREE_FALLBACK_INDENT = 20;

function getThemeSizeToken(token: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const rawValue = window.getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const parsed = Number.parseFloat(rawValue);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildArboristTree(data: RoleResponseInterface[]): ArboristNode[] {
  const nodeMap = new Map<number, ArboristNode>();

  data.forEach(role => {
    nodeMap.set(role.id, {
      id: role.id.toString(),
      name: role.name,
      levelName: role.level?.name || role.level?.sigla || "",
      children: undefined
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

function arboristTreeToFlowElements(nodes: ArboristNode[]): { nodes: Node[]; edges: Edge[] } {
  dagreGraph.nodes().forEach(n => dagreGraph.removeNode(n));
  dagreGraph.setGraph({ rankdir: "TB" });

  const flowNodes: Node[] = [];
  const flowEdges: Edge[] = [];

  function flatten(nodeList: ArboristNode[], parentId?: string) {
    for (const node of nodeList) {
      dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
      flowNodes.push({
        id: node.id,
        data: { label: node.name },
        position: { x: 0, y: 0 }
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
      x: dagreNode.x - NODE_WIDTH / 2,
      y: dagreNode.y - NODE_HEIGHT / 2
    };
  });

  return { nodes: flowNodes, edges: flowEdges };
}

function NodeRenderer({ node, style, dragHandle }: NodeRendererProps<ArboristNode>) {
  const hasChildren = !node.isLeaf;
  const indent = getThemeSizeToken("--system-detail-role-indent-size", TREE_FALLBACK_INDENT);
  const iconBoxHalf = getThemeSizeToken("--system-detail-role-icon-box-size", 24) / 2;

  const nodeClassName = [
    "role-hierarchy__node",
    node.isSelected ? "role-hierarchy__node--selected" : "",
    node.isDragging ? "role-hierarchy__node--dragging" : "",
    node.willReceiveDrop ? "role-hierarchy__node--drop-target" : ""
  ].filter(Boolean).join(" ");

  return (
    <div
      style={style}
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

      {hasChildren
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
  const [treeData, setTreeData] = useState<ArboristNode[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
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
        title: "Erro",
        description: "Dados inválidos para atualização",
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
          title: "Papéis atualizados",
          description: "Os papéis foram atualizados com sucesso"
        });
        onSuccess?.();
      }),
      catchError((error: unknown) => {
        const errorMessage: string = formatErrorMessages(error);
        toast({
          title: "Erro ao atualizar papéis",
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
            <h3 className="role-hierarchy__panel-title">Organização de papéis</h3>
            <p className="role-hierarchy__panel-description">Arraste os nós para redefinir a estrutura hierárquica.</p>
          </div>

          <div className="role-hierarchy__tree-surface" ref={treeContainerRef}>
            <Tree<ArboristNode>
              className="role-hierarchy__tree"
              data={treeData}
              onMove={handleMove}
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
              Salvar hierarquia
            </Button>
          </div>
        </div>

        <div className="role-hierarchy__divider" />

        <div className="role-hierarchy__panel role-hierarchy__panel--preview">
          <div className="role-hierarchy__panel-header">
            <h3 className="role-hierarchy__panel-title">Visualização</h3>
          </div>

          <div className="role-hierarchy__flow-surface">
          <ReactFlow
            className="role-hierarchy__flow"
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            nodesDraggable={false}
            nodesConnectable={false}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} />
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
