import { useEffect, useState } from "react";
import { StaticTreeDataProvider, Tree, UncontrolledTreeEnvironment } from "react-complex-tree";
import "react-complex-tree/lib/style-modern.css";
import { toast } from "../../../../common/external/ui/use-toast.ts";
import { catchError, finalize, from, tap } from "rxjs";
import { StepLoader } from "../../../../common/components/loading/StepLoader.tsx";
import { Button } from "../../../../common/external/ui/button.tsx";
import { roleService } from "../../common/service/role-service.ts";
import { RoleResponseInterface } from "../../common/types/role.model.ts";
import { formatErrorMessages } from "../../../../common/utils/error-utils.ts";

type TreeRoleType = {
  index: string,
  isFolder: boolean,
  children: string[],
  data: any,
}

interface TreeRoleProps {
  data?: RoleResponseInterface[],
  onSuccess?: () => Promise<void>
}

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
        children: validData.filter(o => o.roleParent === undefined).map((_) => `${_.name}`) || [""],
        data: "Root item"
      } as TreeRoleType
    };

    validData.forEach((item) => {
      items[`${item.name}`] = {
        index: `${item.name}`,
        isFolder: true,
        children: validData.filter(o => o?.roleParent?.id === item?.id).map((o) => `${o.name}`) || [""],
        data: item.name
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
      const parentName = !item?.name || childParentMap[item?.name];
      item.roleParent = parentName ? validData.find(o => o.name === parentName) : undefined;
    });

    return validData;
  };

  const handleSave = () => {
    const roleDTOList = convertToRoleDTOList(items);
    const clientId = roleDTOList[0].client!.id;
    const rolePayload = roleDTOList.map((role) => {
      return {
        id: role.id,
        parentId: role.roleParent?.id,
        clientId
      }
    });

    setLoading(true);
    from(roleService.update(rolePayload as any)).pipe(
      tap(() => {
        toast({
          title: "Papéis atualizados",
          description: "Os papéis foram atualizados com sucesso"
        });
        onSuccess?.();
      }),
      catchError((error) => {
        const errorMessage: string = formatErrorMessages(error.error);
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
        <div className="w-96">
          <div>
            <UncontrolledTreeEnvironment<string>
              dataProvider={new StaticTreeDataProvider(items, (item, newName) => ({ ...item, data: newName }))}
              getItemTitle={item => item.data}
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
