// import React, { Dispatch, SetStateAction } from "react";
// import { CheckPill } from "./CheckPill";
// import { OPTIONS } from "./options";
// import { Button } from "../ui/button";
// import { Clock, Download } from "lucide-react";
// import { motion } from "framer-motion";

// export const Detail = ({
//   selected,
//   setSelected,
// }: {
//   selected: number;
//   setSelected: Dispatch<SetStateAction<number>>;
// }) => {
//   const isLastSelected = selected === OPTIONS.length - 1;

//   return (
//     <div className="w-full max-w-xl mt-6">
      
//       <h2 className="mb-3 text-left text-2xl font-bold leading-tight md:text-2xl md:leading-tight">
//         Acompanhar solicitação
//       </h2>

//       <div className="mt-6 w-full grid grid-cols-2 gap-y-4">
//         <p><span className="font-bold">Sistema:</span><br /> Portal RH</p>
//         <p><span className="font-bold">Função solicitada:</span><br /> Gerente</p>
//         <p><span className="font-bold">Data de envio:</span><br /> 15/07/2024</p>
//         <p><span className="font-bold">Solicitante:</span><br /> José Maria</p>
//         <p><span className="font-bold">Gerente:</span><br /> Maria José</p>
//         <p><span className="font-bold">Motivo do acesso:</span><br /> Gerenciar sistema</p>
//       </div>

//       <div className="mt-4 mb-8 w-full grid grid-cols-2">
//         <div className="max-w-xl">
//           <span className="font-bold">Anexos:</span>
          
//           <div className="flex justify-between p-1 hover:text-primary hover:cursor-pointer gap-x-4 mt-2">
//             <p className="">
//               arquivo.doc
//             </p>
//             <Download className="w-5" />
//           </div>
//           <div className="flex justify-between p-1 hover:text-primary hover:cursor-pointer gap-x-4 mt-1">
//             <p className="">
//               documento.pdf
//             </p>
//             <Download className="w-5" />
//           </div>
//           <div className="flex justify-between p-1 hover:text-primary hover:cursor-pointer gap-x-4 mt-1">
//             <p className="">
//               texto.txt
//             </p>
//             <Download className="w-5" />
//           </div>
//         </div>
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
//         <motion.div
//           initial={{ y: 12, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           exit={{ y: -12, opacity: 0 }}
//         >
//           <div className="flex gap-x-2">
//             <Clock className="w-5 h-5 text-red-500" />
//             <h2 className="text-lg mb-6">
//               Essa solicitação foi <span className="font-bold">finalizada</span> e aguarda definição.
//             </h2>
//           </div>
//           <div className="w-full flex gap-4">
//             <Button className="w-40 bg-yellow-200 text-yellow-800 hover:bg-yellow-800 hover:text-yellow-200" type="submit" onClick={() => {}}>
//               Rejeitar
//             </Button>
//             <Button className="w-40 bg-green-200 text-green-800 hover:bg-green-800 hover:text-green-200" type="submit" onClick={() => {}}>
//               Aprovar
//             </Button>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// };


import React, { Dispatch, SetStateAction } from "react";
import { CheckPill } from "./CheckPill";
import { OPTIONS } from "./options";
import { Button } from "../ui/button";
import { Clock, Download } from "lucide-react";
import { motion } from "framer-motion";
import { format } from 'date-fns';

export const Detail = ({
  selected,
  setSelected,
  data
}: {
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
  data: any;
}) => {
  const isLastSelected = selected === OPTIONS.length - 1;

  const formattedDate = data?.criacao ? format(new Date(data.criacao), 'dd/MM/yyyy') : '';

  return (
    <div className="w-full max-w-xl mt-6">
      
      <h2 className="mb-3 text-left text-2xl font-bold leading-tight md:text-2xl md:leading-tight">
        Acompanhar solicitação
      </h2>

      <div className="mt-6 w-full grid grid-cols-2 gap-y-4">
        <p><span className="font-bold">Sistema:</span><br /> {data?.role.client.name}</p>
        <p><span className="font-bold">Função solicitada:</span><br /> {data?.role.name}</p>
        <p><span className="font-bold">Data de envio:</span><br /> {formattedDate}</p>
        <p><span className="font-bold">Solicitante:</span><br /> {data?.requestingUser.firstName}</p>
        <p><span className="font-bold">Motivo do acesso:</span><br /> {data?.description}</p>
      </div>

      <div className="mt-4 mb-8 w-full grid grid-cols-2">
        <div className="max-w-xl">
          <span className="font-bold">Anexos:</span>
          {data?.attachments?.map((file, index) => (
            <div
              key={index}
              className="flex justify-between p-1 hover:text-primary hover:cursor-pointer gap-x-4 mt-2"
            >
              <p>{file}</p>
              <Download className="w-5" />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-14 flex flex-wrap justify-start gap-3">
        {OPTIONS.map((o, i) => (
          <CheckPill
            key={o.title}
            index={i}
            selected={i === selected}
            setSelected={setSelected}
            currentIndex={selected}
          >
            {o.title}
          </CheckPill>
        ))}
      </div>

      {isLastSelected && (
        <motion.div
          className="absolute"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
        >
          <div className="flex gap-x-2">
            <Clock className="w-5 h-5 text-red-500" />
            <h2 className="text-lg mb-6">
              Essa solicitação foi <span className="font-bold">finalizada</span> e aguarda definição.
            </h2>
          </div>
          <div className="w-full flex gap-4">
            <Button className="w-40 bg-yellow-200 text-yellow-800 hover:bg-yellow-800 hover:text-yellow-200" type="submit">
              Rejeitar
            </Button>
            <Button className="w-40 bg-green-200 text-green-800 hover:bg-green-800 hover:text-green-200" type="submit">
              Aprovar
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
