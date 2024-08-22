// import { Tree } from "react-arborist";
// import { data } from "./data";

// export default function Arbol() {
//   return (
//     <div className="App">
//       <Tree className="Tree" initialData={data} />
//     </div>
//   );
// }


'use client'
import { NodeRendererProps, Tree } from "react-arborist";
import { data } from "./data";
import { Medal, User, Shield, Crown } from "lucide-react"; // Adicione mais ícones conforme necessário

function Node({ node, style, dragHandle }: NodeRendererProps<any>) {
  // Função para selecionar o ícone com base no nome do item
  const getIcon = (name: string) => {
    switch (name) {
      case "Diretor":
        return <Crown />; // Ícone para diretor
      case "Gerente":
        return <Medal />; // Ícone para gerente
      case "Admin":
        return <Shield />; // Ícone para administrador
      case "Usuário":
      default:
        return <User />; // Ícone para usuário
    }
  };

  return (
    <div className="flex cursor-move p-1" style={style} ref={dragHandle} onClick={() => node.toggle()}>
      
      <div className="w-[140px] border rounded flex gap-2 px-3 p-2 items-center">
        {getIcon(node.data.name)}
        {node.data.name}
      </div>
      
    </div>
  );
}

/* Customize Appearance */
export default function App() {
  return (
    <Tree
      initialData={data}
      openByDefault={false}
      width={600}
      height={400}
      indent={24}
      // rowHeight={36}
      rowHeight={50}
      paddingTop={30}
      paddingBottom={10}
      padding={15 /* sets both */}
    >
      {Node}
    </Tree>
  );
}






// 'use client'
// import { NodeRendererProps, Tree } from "react-arborist";
// import { data } from "./data";
// import { Medal, User } from "lucide-react";

// function Node({ node, style, dragHandle }: NodeRendererProps<any>) {
//   /* This node instance can do many things. See the API reference. */
//   return (
//     <div className="flex" style={style} ref={dragHandle} onClick={() => node.toggle()}>
//       {node.isLeaf ? <User /> : <Medal />} {node.data.name}
//     </div>
//   );
// }

// /* Customize Appearance */
// export default function App() {
//   return (
//     <Tree
//       initialData={data}
//       openByDefault={false}
//       width={600}
//       height={1000}
//       indent={24}
//       rowHeight={36}
//       paddingTop={30}
//       paddingBottom={10}
//       padding={25 /* sets both */}
//     >
//       {Node}
//     </Tree>
//   );
// }
