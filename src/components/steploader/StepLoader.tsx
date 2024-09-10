// 
// import React, { useState } from "react";
// import { MultiStepLoader as Loader } from "../ui/multi-step-loader";
// import { IconSquareRoundedX } from "@tabler/icons-react";
// import { Button } from "../ui/button";

// const loadingStates = [
//   {
//     text: "Carregou os dados",
//   },
//   {
//     text: "Conexão estabelecida",
//   },
//   {
//     text: "Encontrou com Putin",
//   },
//   {
//     text: "Ele fez sabão",
//   },
//   {
//     text: "Fomos pro bar",
//   },
//   {
//     text: "Iniciou uma briga",
//   },
//   {
//     text: "Curtimos",
//   },
//   {
//     text: "Importação concluída!",
//   },
// ];

// export function StepLoader() {
//   const [loading, setLoading] = useState(false);
//   return (
//     <div className="flex items-center justify-center">
//       {/* Core Loader Modal */}
//       <Loader loadingStates={loadingStates} loading={loading} duration={2000} />

//       {/* The buttons are for demo only, remove it in your actual code ⬇️ */}
//       <Button
//         onClick={() => setLoading(true)}
        
//       >
//         Clique para carregar
//       </Button>

//       {loading && (
//         <button
//           className="fixed top-4 right-4 text-black dark:text-white z-[120]"
//           onClick={() => setLoading(false)}
//         >
//           <IconSquareRoundedX className="h-10 w-10" />
//         </button>
//       )}
//     </div>
//   );
// }



// comportamento alterado para fechar o modal automaticamente
// 
// import React, { useState } from "react";
// import { MultiStepLoader as Loader } from "../ui/multi-step-loader";
// import { IconSquareRoundedX } from "@tabler/icons-react";
// import { Button } from "../ui/button";

// const loadingStates = [
//   {
//     text: "Carregou os dados",
//   },
//   {
//     text: "Conexão estabelecida",
//   },
//   {
//     text: "A solicitação foi criada!",
//   },
//   {
//     text: "Completo",
//   },
// ];

// export function StepLoader() {
//   const [loading, setLoading] = useState(false);

//   return (
//     <div className="flex items-center justify-center">
//       {/* Core Loader Modal */}
//       <Loader
//         loadingStates={loadingStates}
//         loading={loading}
//         duration={2000}
//         loop={false} // Desativa o loop, para fechar a modal quando terminar
//         onClose={() => setLoading(false)} // Fecha a modal quando os steps terminam
//       />

//       {/* Os botões são somente para demonstração, remover quando for usar na aplicação ⬇️ */}
//       <Button
//         onClick={(e) => {
//             e.preventDefault(); // Evita que o botão submeta o formulário
//             setLoading(true);
//         }}
//       >
//         Clique para carregar
//       </Button>

//       {loading && (
//         <button
//           className="fixed top-4 right-4 text-black dark:text-white z-[120]"
//           onClick={() => setLoading(false)}
//         >
//           <IconSquareRoundedX className="h-10 w-10" />
//         </button>
//       )}
//     </div>
//   );
// }

import React, { useState } from "react";
import { MultiStepLoader as Loader } from "../ui/multi-step-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { Button } from "../ui/button";

const loadingStates = [
  // Estados de carregamento
  { text: "Carregando" },
  { text: "Conexão estabelecida" },
  { text: "A solicitação foi criada!" },
  { text: "Sucesso" },
];

// Defina a interface para as props do StepLoader
interface StepLoaderProps {
  onClose?: () => void; // onClose é opcional e é uma função que não recebe argumentos e não retorna nada
}

export function StepLoader({ onClose }: StepLoaderProps) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <Loader
        loadingStates={loadingStates}
        loading={loading}
        duration={2000}
        loop={false} // Desativa o loop
        onClose={() => {
          setLoading(false);
          if (onClose) onClose(); // Chama onClose ao finalizar
        }}
      />
      <Button
        onClick={(e) => {
          e.preventDefault();
          setLoading(true);
        }}
      >
        Enviar
      </Button>
      {loading && (
        <button
          className="fixed top-4 right-4 text-black dark:text-white z-[120]"
          onClick={() => setLoading(false)}
        >
          <IconSquareRoundedX className="h-10 w-10" />
        </button>
      )}
    </div>
  );
}
