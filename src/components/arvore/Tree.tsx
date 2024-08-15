'use client'
import React, { useState } from 'react';
import {
  SimpleTreeItemWrapper,
  FolderTreeItemWrapper,
  SortableTree,
  TreeItemComponentProps,
  TreeItems,
} from 'dnd-kit-sortable-tree';

export default function Tree() {
  const [items, setItems] = useState(initialViableMinimalData);
  return (
    <SortableTree
      items={items}
      onItemsChanged={setItems}
      TreeItemComponent={TreeItem}
      indentationWidth={20}
      disableSorting={false}
      dropAnimation={{}}
    />
  );
}

type MinimalTreeItemData = {
  value: string;
};
/*
 * Here's the component that will render a single row of your tree
 */
const TreeItem = React.forwardRef<
  HTMLDivElement,
  TreeItemComponentProps<MinimalTreeItemData>
>((props, ref) => {
  const [sample, setSample] = useState('');
  return (
    <SimpleTreeItemWrapper className="" {...props} ref={ref}>
      <div className="w-40 text-black dark:text-white">{props.item.value}</div>
      {/* <div className=" w-40 ml-6">{props.item.value}</div> */}
      {/* <input
        className="bg-orange-100 ml-6"
        value={sample}
        onChange={(e) => {
          setSample(e.target.value);
        }}
      ></input> */}
    </SimpleTreeItemWrapper>
  );
});
/*
 * Configure the tree data.
 */
const initialViableMinimalData: TreeItems<MinimalTreeItemData> = [
  {
    id: 1,
    value: 'Diretor',
    children: [
      { id: 3, value: 'Administrador' },
      { id: 4, value: 'Usuário' },
    ],
  },
  { id: 2, value: 'Gerente', children: [{ id: 5, value: 'Usuário' }] },
];



// com botao de apagar
// 'use client'
// import React, { useState } from 'react';
// import {
//   SimpleTreeItemWrapper,
//   SortableTree,
//   TreeItemComponentProps,
//   TreeItems,
// } from 'dnd-kit-sortable-tree';

// export default function Tree() {
//   const [items, setItems] = useState(initialViableMinimalData);

//   // Função para remover um item pelo ID
//   const handleDelete = (id: number) => {
//     setItems((prevItems) => removeItem(prevItems, id));
//   };

//   return (
//     <SortableTree
//       items={items}
//       onItemsChanged={setItems}
//       TreeItemComponent={(props) => <TreeItem {...props} onDelete={handleDelete} />}
//       indentationWidth={20}
//       disableSorting={false}
//       dropAnimation={{}}
//     />
//   );
// }

// type MinimalTreeItemData = {
//   value: string;
// };

// type TreeItemProps = TreeItemComponentProps<MinimalTreeItemData> & {
//   onDelete: (id: number) => void;
// };

// // Componente de Item da Árvore
// const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>((props, ref) => {
//   const { item, onDelete } = props;

//   // Função para lidar com o clique no botão de apagar
//   const handleDelete = () => {
//     onDelete(item.id);
//   };

//   return (
//     <SimpleTreeItemWrapper className="" {...props} ref={ref}>
//       <div className="flex items-center">
//         <div className="w-40 text-black dark:text-white">{item.value}</div>
//         <button
//           className="ml-4 bg-red-500 text-white px-2 py-1 rounded"
//           onClick={handleDelete}
//         >
//           Apagar
//         </button>
//       </div>
//     </SimpleTreeItemWrapper>
//   );
// });

// // Função utilitária para remover um item da árvore
// const removeItem = (items: TreeItems<MinimalTreeItemData>, id: number): TreeItems<MinimalTreeItemData> => {
//   return items
//     .map((item) => ({
//       ...item,
//       children: removeItem(item.children || [], id),
//     }))
//     .filter((item) => item.id !== id);
// };

// // Dados iniciais da árvore
// const initialViableMinimalData: TreeItems<MinimalTreeItemData> = [
//   {
//     id: 1,
//     value: 'Diretor',
//     children: [
//       { id: 3, value: 'Administrador' },
//       { id: 4, value: 'Usuário' },
//     ],
//   },
//   { id: 2, value: 'Gerente', children: [{ id: 5, value: 'Usuário' }] },
// ];
