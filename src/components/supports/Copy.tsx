// import React, { Dispatch, SetStateAction } from "react";
// import { CheckPill } from "./CheckPill";
// import { OPTIONS } from "./options";
// import { Button } from "../ui/button";
// import { Clock } from "lucide-react";

// export const Copy = ({
//   selected,
//   setSelected,
// }: {
//   selected: number;
//   setSelected: Dispatch<SetStateAction<number>>;
// }) => {
//   const isLastSelected = selected === OPTIONS.length - 1;

//   return (
//     <div className="w-full max-w-xl mt-4">
//       <h2 className="mb-3 text-left text-2xl font-bold leading-tight md:text-2xl md:leading-tight">
//         Acompanhar solicitação
//       </h2>
    
//       <div className="mt-6 mb-8 w-full grid grid-cols-2 gap-y-2">
//         <p><span className="font-bold">Sistema:</span><br /> Portal RH</p>
//         <p><span className="font-bold">Função solicitada:</span><br /> Gerente</p>
//         <p><span className="font-bold">Data de envio:</span><br /> 15/07/2024</p>
//         <p><span className="font-bold">Solicitante:</span><br /> José Maria</p>
//         <p><span className="font-bold">Gerente:</span><br /> Maria José</p>
//         <p><span className="font-bold">Motivo do acesso:</span><br /> Gerenciar sistema</p>
//       </div>

//       <div className="mb-14 flex flex-wrap justify-start gap-3">
//         {OPTIONS.map((o, i) => {
//           return (
//             <CheckPill
//               key={o.title}
//               index={i}
//               selected={i === selected}
//               setSelected={setSelected}
//               currentIndex={selected}
//             >
//               {o.title}
//             </CheckPill>
//           );
//         })}
//       </div>

//       {isLastSelected && (
//         <div>
//           <h2 className="text-lg mb-6 flex gap-x-2">
//             <Clock className="text-red-500" />
//             Essa solicitação foi <strong>finalizada</strong> e aguarda definição.
//           </h2>
//           <div className="w-full flex gap-4">
//             <Button className="w-40 bg-yellow-200 text-yellow-800 hover:bg-yellow-800 hover:text-yellow-200" type="submit" onClick={() => {}}>
//               Rejeitar
//             </Button>
//             <Button className="w-40 bg-green-200 text-green-800 hover:bg-green-800 hover:text-green-200" type="submit" onClick={() => {}}>
//               Aprovar
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


import React, { Dispatch, SetStateAction } from "react";
import { CheckPill } from "./CheckPill";
import { OPTIONS } from "./options";
import { Button } from "../ui/button";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

export const Copy = ({
  selected,
  setSelected,
}: {
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}) => {
  const isLastSelected = selected === OPTIONS.length - 1;

  return (
    <div className="w-full max-w-xl mt-4">
      {/* <span className="mb-1.5 block text-center text-indigo-600 md:text-start">
        Acompanhar solicitação
      </span> */}
      <h2 className="mb-3 text-left text-2xl font-bold leading-tight md:text-2xl md:leading-tight">
        Acompanhar solicitação
      </h2>
      {/* <p className="mb-6 text-left text-base leading-relaxed md:text-md md:leading-relaxed">
        
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum,
        assumenda. Adipisci vitae autem voluptas, repudiandae consequuntur quis et,
        aliquid, perspiciatis repellendus assumenda iure blanditiis.
      </p> */}

      <div className="mt-6 mb-8 w-full grid grid-cols-2 gap-y-2">
        <p><span className="font-bold">Sistema:</span><br /> Portal RH</p>
        <p><span className="font-bold">Função solicitada:</span><br /> Gerente</p>
        <p><span className="font-bold">Data de envio:</span><br /> 15/07/2024</p>
        <p><span className="font-bold">Solicitante:</span><br /> José Maria</p>
        <p><span className="font-bold">Gerente:</span><br /> Maria José</p>
        <p><span className="font-bold">Motivo do acesso:</span><br /> Gerenciar sistema</p>
      </div>

      <div className="mb-14 flex flex-wrap justify-start gap-3">
        {OPTIONS.map((o, i) => {
          return (
            <CheckPill
              key={o.title}
              index={i}
              selected={i === selected}
              setSelected={setSelected}
              currentIndex={selected}
            >
              {o.title}
            </CheckPill>
          );
        })}
      </div>

      {isLastSelected && (
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
        >
          <h2 className="text-lg mb-6 flex items-center gap-x-2">
            <Clock className="w-5 h-5 text-red-500" />
            Essa solicitação foi <strong>finalizada</strong> e aguarda definição.
          </h2>
          <div className="w-full flex gap-4">
            <Button className="w-40 bg-yellow-200 text-yellow-800 hover:bg-yellow-800 hover:text-yellow-200" type="submit" onClick={() => {}}>
              Rejeitar
            </Button>
            <Button className="w-40 bg-green-200 text-green-800 hover:bg-green-800 hover:text-green-200" type="submit" onClick={() => {}}>
              Aprovar
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
