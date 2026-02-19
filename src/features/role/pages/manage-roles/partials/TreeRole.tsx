import { useEffect, useState } from "react";
import { StaticTreeDataProvider, Tree, UncontrolledTreeEnvironment } from "react-complex-tree";
import "react-complex-tree/lib/style-modern.css";
import { toast } from "../../../../../common/external/ui/use-toast.ts";
import { catchError, finalize, from, tap } from "rxjs";
import { StepLoader } from "../../../../../common/components/loading/StepLoader.tsx";
import { Button } from "../../../../../common/external/ui/button.tsx";
import { roleService } from "../../../common/service/role-service.ts";
import { RoleResponseInterface } from "../../../common/types/role.model.ts";
import { formatErrorMessages } from "../../../../../common/utils/error-utils.ts";
import { RoleUpdatePayload, TreeRoleProps, TreeRoleType } from "../../../common/types/tree-role.model.ts";
import { Badge } from "../../../../../common/external/ui/badge.tsx";

function TreeRole({ data, onSuccess }: Readonly<TreeRoleProps>) {
  const [items, setItems] = useState<{ [key: string]: TreeRoleType }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(data) {
      setItems(buildTreeObject(data));
    }
  }, [data]);

  function buildTreeObject(backendData: RoleResponseInterface[]) {
    const validData = Array.isArray(backendData) ? backendData : [];

    const items: { [key: string]: TreeRoleType } = {
      root: {
        index: "root",
        isFolder: true,
        children: validData.filter(o => o.roleParent === undefined).map((_) => `${_.name}`),
        data: { name: "Root item", levelName: "" }
      }
    };

    validData.forEach((item) => {
      items[`${item.name}`] = {
        index: `${item.name}`,
        isFolder: true,
        children: validData.filter(o => o?.roleParent?.id === item?.id).map((o) => `${o.name}`),
        data: { name: item.name, levelName: item.level?.name || item.level?.sigla || "" }
      };
    });
    return items;
  }

  const convertToRoleDTOList = (items: { [key: string]: TreeRoleType }): RoleResponseInterface[] => {
    const validData = Array.isArray(data) ? data : [];

    const childParentMap: { [key: string]: string } = {};
    Object.keys(items).forEach(key => {
      if(key !== "root") {
        const item = items[key];
        item.children.forEach(child => {
          childParentMap[child] = key;
        });
      }
    });

    validData.forEach((item) => {
      const parentName = item?.name ? childParentMap[item.name] : undefined;
      item.roleParent = parentName ? validData.find(o => o.name === parentName) : undefined;
    });

    return validData;
  };

  const handleSave = () => {
    const roleDTOList = convertToRoleDTOList(items);

    if (!roleDTOList.length || !roleDTOList[0].client?.id) {
      toast({
        title: "Erro",
        description: "Dados inválidos para atualização",
        variant: "destructive"
      });
      return;
    }

    const clientId = roleDTOList[0].client.id;
    const rolePayload: RoleUpdatePayload[] = roleDTOList.map((role) => ({
      id: role.id,
      parentId: role.roleParent?.id,
      clientId
    }));

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
      <div
        className="w-full max-w-xl flex justify-between items-start bg-zebra-background-2 rounded-xl border py-8 px-8 h-auto min-h-[220px] ">
        <div className="w-96 max-w-full">
          <div>
            <UncontrolledTreeEnvironment<string | { name: string; levelName: string }>
              dataProvider={new StaticTreeDataProvider(items, (item, newName) => ({ ...item, data: newName }))}
              getItemTitle={item => typeof item.data === "string" ? item.data : item.data.name}
              renderItem={({ item, title, arrow, depth, context, children }) => {
                const levelName = typeof item.data === "object" && item.data.levelName ? item.data.levelName : "";
                const InteractiveComponent = context.isRenaming ? 'div' : 'button';
                return (
                  <li
                    {...(context.itemContainerWithChildrenProps as object)}
                    className="rct-tree-item-li"
                  >
                    <div
                      className="rct-tree-item-title-container"
                      style={{ paddingLeft: `${(depth || 0) * 20}px` }}
                    >
                      {arrow}
                      <InteractiveComponent
                        {...(context.interactiveElementProps as object)}
                        className="rct-tree-item-button"
                      >
                        <span className="flex items-center gap-2">
                          <span>{title}</span>
                          {levelName && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-medium whitespace-nowrap">
                              {levelName}
                            </Badge>
                          )}
                        </span>
                      </InteractiveComponent>
                    </div>
                    {children}
                  </li>
                );
              }}
              viewState={{
                "tree-1": {}
              }}
              canDragAndDrop={true}
              canDropOnFolder={true}
              canReorderItems={true}
            >
              <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" treeLabelledBy="tree-label" />
            </UncontrolledTreeEnvironment>
          </div>
        </div>
        <div className="mt-2">
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </div>
      </div>
      <StepLoader loading={loading} onClose={() => setLoading(false)} />
    </>
  );
}

export default TreeRole;
