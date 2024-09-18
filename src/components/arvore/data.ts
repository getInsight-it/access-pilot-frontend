// export const data = [
//     {
//       id: "1",
//       name: "Diretor",
//       children: [
//         { id: "a1", name: "Usuário" },
//         { id: "a2", name: "Usuário" },
//         { id: "a3", name: "Usuário" }
//       ]
//     },
//     {
//       id: "2",
//       name: "Gerente",
//       // children: [
//       //   { id: "b1", name: "Usuário" },
//       // ]
//     },
//     { id: "3",
//       name: "Admin",
//       // children: [
//       //   { id: "c1", name: "Usuário" },
//       // ]
//     },
//     { id: "4", name: "Usuário" },
//   ];

import { Children } from "react";

  
export const data = [
  { id: "1", name: "Diretor", children: [
    { id: "a1", name: "Usuário" }
  ] },
  { id: "2", name: "Gerente", children: [] },
  { id: "3", name: "Admin", children: [] },
  {
    id: "4",
    name: "Usuário",
    children: [],
  }
];