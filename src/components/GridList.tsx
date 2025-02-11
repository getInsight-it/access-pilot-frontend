// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import systems from '../constants/sistemas';
// import { Check, ExternalLink, LayoutGrid, List, MonitorIcon } from "lucide-react";
// import { CardShine } from "./CardShine";

// const variants = {
//   hidden: { opacity: 0, scale: 0.99 },
//   visible: { opacity: 1, scale: 1 },
//   exit: { opacity: 0, scale: 0.99 },
// };

// const transition = {
//   duration: 0.3, // Duracao da transição em segundos
//   ease: "easeInOut" // Tipo de easing
// };

// function GridList() {
//   const [toggleViewMode, setToggleViewMode] = useState(true);
//   const [isAnimating, setIsAnimating] = useState(false);

//   const handleToggleViewMode = () => {
//     if (!isAnimating) {
//       setToggleViewMode(!toggleViewMode);
//     }
//   };

//   return (
//     <div>
//       <div className="flex items-center justify-between pr-2">
//         {/* <h2 className="mt-4 ml-1 font-bold text-xl">Sistemas que você tem acesso.</h2>
//         <button
//           className="
//             font-bold
//             grid
//             items-center
//             justify-center

//             text-primary-foreground
//             bg-primary

//             rounded-full
//             w-10
//             h-10
//           "
//           onClick={handleToggleViewMode}
//           disabled={isAnimating}
//         >
//           {toggleViewMode ? <List className="h-5 w-5 " /> : <LayoutGrid className="h-5 w-5 " />}
//         </button> */}
//       </div>

//       <AnimatePresence mode="wait">
//         <motion.div
//           key={toggleViewMode ? "grid" : "list"}
//           initial="hidden"
//           animate="visible"
//           exit="exit"
//           variants={variants}
//           transition={transition}
//           className={toggleViewMode ? "grid-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4" : "list-container list-none w-full lg:h-[343px] flex flex-col gap-2"}
//           onAnimationStart={() => setIsAnimating(true)}
//           onAnimationComplete={() => setIsAnimating(false)}
//         >
//           {systems.map((system) => (
//             <motion.div
//               key={system.id}
//               className={toggleViewMode ? "grid-item flex-[1_1_30%]" : "list-item"}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               variants={variants}
//               transition={transition}
//             >

//               <CardShine>

//                 <div className=" p-5 grid items-center h-auto transition-all rounded-[var(--card-border-radius)] ">
//                   <ExternalLink className="absolute w-4 h-4 top-5 right-5" />

//                   <div className="flex flex-row items-center">
//                     <MonitorIcon className="w-6 h-6 mr-4" />
//                     <p className="font-bold text-lg">
//                       {system.name}
//                     </p>
//                   </div>

//                   <p className="mt-1 text-sm">
//                     {system.description ? system.description : "Sem função atribuída"}
//                   </p>
//                 </div>
//               </CardShine>



//               {/* <CardShine>
//                 <div className={toggleViewMode ? "p-4 min-h-[100px]" : " p-4"}>
//                   <div className="mt-4 absolute top-0 right-3">
//                     <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
//                       {system.status}
//                     </span>
//                   </div>
//                   <div className={toggleViewMode ? " " : "flex gap-4 items-end "}>

//                     <img
//                       className={toggleViewMode ? "w-12" : "w-6"}
//                       src={system.url ? system.url : "/img/ap.svg"} // Verifica se 'url' existe, senão usa uma imagem padrão
//                       alt="Imagem do sistema"
//                     />

//                     <div className="flex flex-row items-center space-x-4">
//                       <MonitorIcon className={toggleViewMode ? "w-8" : "w-6"} />
//                       <div className="flex flex-col">
//                         <p className={`font-bold relative ${toggleViewMode ? "text-lg" : "text-md"}`}>
//                           {system.name}
//                         </p>
//                         <p className="text-sm text-gray-400">
//                           {system.role ? system.role : "Sem função atribuída"}
//                         </p>
//                       </div>
//                     </div>

//                     <MonitorIcon className={toggleViewMode ? "w-8" : "w-6"} />

//                     <p className={`font-bold ${toggleViewMode ? "text-lg mt-3" : "text-md"}`}>{system.name}</p>

//                     <p className={`font-normal text-base text-neutral-200 ${toggleViewMode ? "mt-1" : " "}`}>
//                       {system.role}
//                     </p>

//                     <div className="mt-2">
//                       <p className={`font-normal text-base ${toggleViewMode ? "mt-1" : " "}`}>
//                         {system.role ? system.role : "Sem função atribuída"}
//                       </p>
//                       <p className="font-normal text-sm">
//                         {system.description ? system.description : "Sem função atribuída"}
//                       </p>
//                     </div>

//                   </div>
//                 </div>
//               </CardShine> */}

//             </motion.div>
//           ))}
//         </motion.div>
//       </AnimatePresence>
//     </div>
//   );
// }

// export default GridList;



import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import systems from "../constants/sistemas";
import {Check, ExternalLink, Eye, LayoutGrid, Link, List, MonitorIcon} from "lucide-react";
import { CardShine } from "./CardShine";
import {Button, buttonVariants} from "./ui/button";
import { clientService } from "../services/client";
import useAuthStore from "../store/authStore";
import { TruncatedDescription } from "./TruncateDescription";
import {PRIVATE_ROUTES} from "../constants/routes.ts";
import {cn} from "../lib/utils.ts";

interface Client {
  id: number;
  clientId: string;
  description: string;
  clientExternalId?: string;
  name?: string;
  clientUUID: string,
  managed: boolean,
  status?: string;
  baseUrl?: string;
}

const variants = {
  hidden: { opacity: 0, scale: 0.99 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.99 },
};

const transition = {
  duration: 0.3, // Duracao da transição em segundos
  ease: "easeInOut" // Tipo de easing
};

function GridList() {

  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

  const [toggleViewMode, setToggleViewMode] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const [clients, setClients] = useState<Client[]>([]);

  const handleToggleViewMode = () => {
    if (!isAnimating) {
      setToggleViewMode(!toggleViewMode);
    }
  };

  const getClients = async () => {
    try {
      const fetchedClients = await clientService.getClientsAssociates(true);
      setClients(fetchedClients);
      // console.log(fetchedClients)
    } catch (error) {
      console.error("Erro ao carregar clients:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getClients();
    }
  }, [isAuthenticated]);

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={toggleViewMode ? "grid" : "list"}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={transition}
          className={toggleViewMode ? "grid-container  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4" : "list-container list-none w-full lg:h-[343px] flex flex-col gap-2"}
          onAnimationStart={() => setIsAnimating(true)}
          onAnimationComplete={() => setIsAnimating(false)}
        >
          {clients.map((client, index) => (
            <motion.div
              key={index}
              className={toggleViewMode ? "grid-item flex-[1_1_30%]" : "list-item"}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              transition={transition}
            >

              <CardShine>
                <div className=" p-5 grid items-center h-auto transition-all rounded-[var(--card-border-radius)] ">
                  <a
                    href={client.baseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black cursor-pointer hover:text-blue-700 underline"
                  >
                    <ExternalLink className="absolute w-4 h-4 top-5 right-5" />
                  </a>

                  <div className="flex flex-row items-center">
                    <MonitorIcon className="w-6 h-6 mr-4"/>
                    <p className="font-bold text-lg">
                      {client.clientId}
                    </p>
                  </div>

                  <TruncatedDescription description={client.description ? client.description : "Sem função atribuída"}/>
                  {/* <p className="mt-1 text-sm">
                  {client.description ? client.description : "Sem função atribuída"}
                </p> */}
                </div>
              </CardShine>


            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default GridList;
