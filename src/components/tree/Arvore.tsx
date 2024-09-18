import React from 'react'
import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider } from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';

function Arvore() {
  const items = {
    root: {
      index: 'root',
      isFolder: true,
      children: ['child1', 'child2'],
      data: 'Root item',
    },
    child1: {
      index: 'child1',
      isFolder: true,
      children: [''],
      data: 'Diretor',
    },
    child2: {
      index: 'child2',
      isFolder: true,
      children: ['child3'],
      data: 'Gerente',
    },
    child3: {
      index: 'child3',
      isFolder: true,
      children: ['child4'],
      data: 'Administrador',
    },
    child4: {
      index: 'child4',
      isFolder: false,
      children: [''],
      data: 'Usuário',
    },
  };

  const dataProvider = new StaticTreeDataProvider(items, (item, newName) => ({ ...item, data: newName }));

  return (
    <UncontrolledTreeEnvironment
      dataProvider={dataProvider}
      getItemTitle={item => item.data}
      viewState={{}}
      canDragAndDrop={true}
      canDropOnFolder={true}
      canReorderItems={true}
    >
      <Tree treeId="tree-2" rootItem="root" treeLabel="Tree Example" />
    </UncontrolledTreeEnvironment>
  );
}

export default Arvore