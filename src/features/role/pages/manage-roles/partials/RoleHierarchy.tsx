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
import { toast } from "../../../../../common/external/ui/use-toast.ts";
import { Button } from "../../../../../common/external/ui/button.tsx";
import { Badge } from "../../../../../common/external/ui/badge.tsx";
import { ChevronDown, ChevronRight, User, Users } from "lucide-react";
import { StepLoader } from "../../../../../common/components/loading/StepLoader.tsx";
import { roleService } from "../../../common/service/role-service.ts";
import { RoleResponseInterface } from "../../../common/types/role.model.ts";
import { formatErrorMessages } from "../../../../../common/utils/error-utils.ts";
import { ArboristNode, RoleHierarchyProps, RoleUpdatePayload } from "../../../common/types/role-hierarchy.model.ts";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const NODE_WIDTH = 160;
const NODE_HEIGHT = 40;

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

const INDENT = 20;

function NodeRenderer({ node, style, dragHandle }: NodeRendererProps<ArboristNode>) {
  const hasChildren = !node.isLeaf;

  const isLastSibling = (n: typeof node): boolean => {
    const siblings = n.parent?.children;
    if (!siblings || siblings.length === 0) return true;
    return siblings[siblings.length - 1].id === n.id;
  };

  const getAncestorAtLevel = (targetLevel: number): typeof node | null => {
    let current: typeof node | null = node;
    while (current && current.level > targetLevel) {
      current = current.parent;
    }
    return current;
  };

  return (
    <div
      style={{ ...style, paddingLeft: 0 }}
      ref={dragHandle}
      className="flex items-center gap-1 pr-1 h-full cursor-pointer select-none hover:bg-muted rounded"
    >
      {node.level > 0 && Array.from({ length: node.level }, (_, i) => {
        const isLastColumn = i === node.level - 1;

        if (isLastColumn) {
          const nodeIsLast = isLastSibling(node);
          return (
            <div
              key={i}
              className="relative shrink-0"
              style={{ width: INDENT, alignSelf: "stretch" }}
            >
              <div
                className="absolute w-px bg-border/60"
                style={{ left: 8, top: 0, bottom: nodeIsLast ? "50%" : 0 }}
              />
              <div
                className="absolute h-px bg-border/60"
                style={{ left: 8, width: INDENT - 8, top: "50%" }}
              />
            </div>
          );
        }

        const ancestor = getAncestorAtLevel(i);
        const ancestorIsLast = ancestor ? isLastSibling(ancestor) : true;

        return (
          <div
            key={i}
            className="relative shrink-0"
            style={{ width: INDENT, alignSelf: "stretch" }}
          >
            {!ancestorIsLast && (
              <div
                className="absolute w-px bg-border/60"
                style={{ left: 8, top: 0, bottom: 0 }}
              />
            )}
          </div>
        );
      })}

      {hasChildren ? (
        <button
          onClick={e => { e.stopPropagation(); node.toggle(); }}
          className="flex items-center justify-center w-4 h-4 shrink-0"
        >
          {node.isOpen
            ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
        </button>
      ) : (
        <span className="w-4 h-4 shrink-0" />
      )}

      {hasChildren
        ? <Users className="w-4 h-4 shrink-0 text-primary" />
        : <User className="w-4 h-4 shrink-0 text-muted-foreground" />}

      <span className="text-sm truncate flex-1">{node.data.name}</span>

      {node.data.levelName && (
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-medium whitespace-nowrap shrink-0">
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
  const [treeWidth, setTreeWidth] = useState(0);

  useEffect(() => {
    const el = treeContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setTreeWidth(el.clientWidth));
    observer.observe(el);
    setTreeWidth(el.clientWidth);
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
      <div className="w-full flex bg-zebra-background-2 rounded-xl border border-gray-300 dark:border-gray-700 min-h-[500px]">
        <div className="w-[30%] flex flex-col justify-between p-6">
          <div ref={treeContainerRef} className="flex-1 min-w-0">
            <Tree<ArboristNode>
              data={treeData}
              onMove={handleMove}
              width={treeWidth || undefined}
              height={400}
              rowHeight={36}
              indent={INDENT}
            >
              {NodeRenderer}
            </Tree>
          </div>
          <Button onClick={handleSave} className="rounded-sm mt-4">
            Salvar
          </Button>
        </div>
        <div className="w-px bg-gray-300 self-stretch" />
        <div className="flex-1 h-[500px] rounded-r-xl overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            nodesDraggable={false}
            nodesConnectable={false}
          >
            <Background variant={BackgroundVariant.Dots} />
            <Controls />
          </ReactFlow>
        </div>
      </div>
      <StepLoader loading={loading} onClose={() => setLoading(false)} />
    </>
  );
}

export default RoleHierarchy;
