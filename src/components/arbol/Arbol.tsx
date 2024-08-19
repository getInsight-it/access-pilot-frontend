// import { Tree } from "react-arborist";
// import { data } from "./data";

// export default function Arbol() {
//   return (
//     <div className="App">
//       <Tree className="Tree" initialData={data} />
//     </div>
//   );
// }


import { NodeRendererProps, Tree } from "react-arborist";
import { data } from "./data";

function Node({ node, style, dragHandle }: NodeRendererProps<any>) {
  /* This node instance can do many things. See the API reference. */
  return (
    <div style={style} ref={dragHandle} onClick={() => node.toggle()}>
      {node.isLeaf ? "🍁" : "🗀"} {node.data.name}
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
      height={1000}
      indent={24}
      rowHeight={36}
      paddingTop={30}
      paddingBottom={10}
      padding={25 /* sets both */}
    >
      {Node}
    </Tree>
  );
}
