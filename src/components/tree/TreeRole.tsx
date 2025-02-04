import React, {useEffect, useState} from 'react'
import {UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider} from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
import {RoleDTO} from "../../services/role/role-dto.ts";
import {roleService} from "../../services/role";
import {toast} from "../ui/use-toast.ts";
import {catchError, finalize, from, tap} from "rxjs";
import {StepLoader} from "../steploader/StepLoader.tsx";
import {Button} from "../ui/button.tsx";

type TreeRoleType = {
  index: string,
  isFolder: boolean,
  children: string[],
  data: any,
}

interface TreeRoleProps {
  data?: RoleDTO[],
  onSuccess?: () => Promise<void>
}

function TreeRole({data, onSuccess}: Readonly<TreeRoleProps>) {
  const [items, setItems] = useState<{ [key: string]: TreeRoleType }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setItems(buildTreeObject(data));
      console.log('data', items);
    }
  }, [data]);


  function buildTreeObject(backendData: RoleDTO[]) {
    const validData = Array.isArray(backendData) ? backendData : [];

    const items = {
      root: {
        index: 'root',
        isFolder: true,
        children: validData.filter(o => o.roleParent === undefined).map((_) => `${_.name}`) || [''],
        data: 'Root item',
      } as TreeRoleType,
    };

    validData.forEach((item) => {
      items[`${item.name}`] = {
        index: `${item.name}`,
        isFolder: true,
        children: validData.filter(o => o?.roleParent?.id === item?.id).map((o) => `${o.name}`) || [''],
        data: item.name,
      };
    });
    return items;
  }

  const convertToRoleDTOList = (items: { [key: string]: TreeRoleType }): RoleDTO[] => {
    const validData = Array.isArray(data) ? data : [];

    const childParentMap: { [key: string]: string } = {};
    Object.keys(items).forEach(key => {
      if (key !== 'root') {
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
  }


  const handleSave = () => {
    const roleDTOList = convertToRoleDTOList(items);
    setLoading(true);
    from(roleService.update(roleDTOList)).pipe(
      tap(() => {
        toast({
          title: "Roles atualizados",
          description: "Os roles foram atualizados com sucesso",
        });
        onSuccess?.();
      }),
      catchError((error) => {
        toast({
          title: "Erro ao atualizar roles",
          description: "Ocorreu um erro ao atualizar os roles",
          variant: "destructive",
        });
        console.error(error);
        return [];
      }),
      finalize(() => setLoading(false))
    ).subscribe();
  }


  return (
    <>
      <div className="w-full max-w-xl flex justify-between items-start gap-x-8 bg-yellow-50 rounded-xl py-8 px-8 h-auto min-h-[220px] ">
        <div className="w-96" >
          <div>
            <UncontrolledTreeEnvironment<string>
              dataProvider={new StaticTreeDataProvider(items, (item, newName) => ({...item, data: newName}))}
              getItemTitle={item => item.data}
              viewState={{
                'tree-1': {},
              }}
              canDragAndDrop={true}
              canDropOnFolder={true}
              canReorderItems={true}
            >
              <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" treeLabelledBy="tree-label" />
            </UncontrolledTreeEnvironment>

            

            {/* <UncontrolledTreeEnvironment<string>
              canDragAndDrop
              canDropOnFolder
              canReorderItems
              dataProvider={new StaticTreeDataProvider(items, (item, newName) => ({...item, data: newName}))}
              getItemTitle={item => item.data}
              viewState={{
                'tree-1': {},
              }}
              renderItemTitle={({ title }) => <span>{title}</span>}
              renderItemArrow={({ item, context }) =>
                item.isFolder ? (
                  context.isExpanded ? (
                    <span className="">{'>'}</span>
                  ) : (
                    <span className="">v</span>
                  )
                ) : null
              }
              renderItem={({ title, arrow, context, children }) => {
                const InteractiveComponent = context.isRenaming ? 'div' : 'button';
                return (
                  <li {...context.itemContainerWithChildrenProps}>
                    <InteractiveComponent
                      type="button"
                      {...context.itemContainerWithoutChildrenProps}
                      {...(context.interactiveElementProps as any)}
                    >
                      {arrow}
                      {title}
                    </InteractiveComponent>
                    {children}
                  </li>
                );
              }}
              renderTreeContainer={({ children, containerProps }) => (
                <div {...containerProps}>{children}</div>
              )}
              renderItemsContainer={({ children, containerProps }) => (
                <ul {...containerProps}>{children}</ul>
              )}
            >
              <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
            </UncontrolledTreeEnvironment> */}
              
          
          </div>
        </div>
        <div className="mt-2">
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </div>
      </div>
      <StepLoader loading={loading} onClose={() => setLoading(false)}/>

    </>
  );
}

export default TreeRole

// continuo na parte do access pilot, estava tocando no modulo de roles a feature de arvore de roles, consegui fazer funcionar,
// so fazer mais alguns testes aqui e
