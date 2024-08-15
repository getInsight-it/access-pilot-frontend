// import React, { useState } from "react";
// import systems from "@/constants/systems";
// import { LayoutGrid, List } from "lucide-react";
// import { GlareCard } from "./ui/GlareCard";

// function GridList() {

//   const [toggleViewMode, setToggleViewMode] = useState(true);

//   return (
//     <div>
//       <div className="flex items-center justify-between mt-4 mb-4 pr-2">
//         <h2 className="mt-4 ml-1 font-bold text-xl">Sistemas que você pode solicitar acesso.</h2>
//         <button
//           className="
//             font-bold
//             grid
//             items-center
//             justify-center
//             bg-black
//             text-white
//             dark:bg-white
//             dark:text-black
//             rounded-full
//             w-10
//             h-10
//           "
//           onClick={() => setToggleViewMode(!toggleViewMode)}
//         >
//           {toggleViewMode ? <List className="h-5 w-5 " /> : <LayoutGrid className="h-5 w-5 " />}
//         </button>
//       </div>

//       <div className={toggleViewMode ? "grid-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4" : "list-container flex flex-wrap flex-col gap-2"}>
//         {systems.map((system) => (
//           <div
//             key={system.id}
//           >
//             <GlareCard
//               className={toggleViewMode ? "grid-container flex flex-col items-start justify-end p-6" : "list-container flex items-center gap-6 p-4"}
//             >
//               <div className="mt-4 absolute top-0 right-3">
//                 <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
//                   {system.status}
//                 </span>
//               </div>
//               <img className={toggleViewMode ? "w-12" : "w-6"} src={system.url} alt="" />
//               <p className={`font-bold text-white text-lg ${toggleViewMode ? "mt-3" : " "}`}>{system.name}</p>
//               <p className={`font-normal text-base text-neutral-200 ${toggleViewMode ? "mt-1" : " "}`}>
//                 {system.role}
//               </p>
//             </GlareCard>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default GridList;



import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import systems from "@/constants/systems";
import { LayoutGrid, List } from "lucide-react";
import { GlareCard } from "./ui/GlareCard";
import { Button } from "./ui/button";

const variants = {
  hidden: { opacity: 0, scale: 0.99 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.99 },
};

const transition = {
  duration: 0.3, // Duracao da transição em segundos
  ease: "easeInOut" // Tipo de easing
};

function GridListNoAccess() {
  const [toggleViewMode, setToggleViewMode] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggleViewMode = () => {
    if (!isAnimating) {
      setToggleViewMode(!toggleViewMode);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mt-4 mb-4 pr-2">
        <h2 className="mt-4 ml-1 font-bold text-xl">Sistemas que você pode solicitar acesso.</h2>
        <button
          className="
            font-bold
            grid
            items-center
            justify-center
            bg-black
            text-white
            dark:bg-white
            dark:text-black
            rounded-full
            w-10
            h-10
          "
          onClick={handleToggleViewMode}
          disabled={isAnimating}
        >
          {toggleViewMode ? <List className="h-5 w-5 " /> : <LayoutGrid className="h-5 w-5 " />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={toggleViewMode ? "grid" : "list"}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={transition}
          className={toggleViewMode ? "grid-container lg:h-[343px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4" : "list-container list-none lg:h-[343px] flex flex-wrap flex-col gap-2"}
          onAnimationStart={() => setIsAnimating(true)}
          onAnimationComplete={() => setIsAnimating(false)}
        >
          {systems.map((system) => (
            <motion.div
              key={system.id}
              className={toggleViewMode ? "grid-item flex-[1_1_30%]" : "list-item"}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              transition={transition}
            >
              <GlareCard
                className={toggleViewMode ? "grid-container flex flex-col items-start justify-end p-6" : "list-container flex items-center gap-6 p-4"}
              >
                <div className="hidden mt-4 absolute top-0 right-3">
                  <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                    {system.status}
                  </span>
                </div>
                <img className={toggleViewMode ? "w-12" : "w-6"} src={system.url} alt="" />
                <p className={`font-bold text-white text-lg ${toggleViewMode ? "mt-3" : " "}`}>{system.name}</p>
                <Button className={toggleViewMode ? "mt-4 relative bg-white text-black" : "mt-2.5 absolute right-4 top-0 bg-white text-black"}>
                  Solicitar acesso
                </Button>
              </GlareCard>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default GridListNoAccess;









// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import systems from "@/constants/systems";
// import { LayoutGrid, List } from "lucide-react";

// const variants = {
//   hidden: { opacity: 0, scale: 0.99 },
//   visible: { opacity: 1, scale: 1 },
//   exit: { opacity: 0, scale: 0.99 },
// };

// function GridList() {
//   const [toggleViewMode, setToggleViewMode] = useState(true);

//   return (
//     <div>
//       <button
//         className="px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
//         onClick={() => setToggleViewMode(!toggleViewMode)}
//       >
//         {toggleViewMode ? <List /> : <LayoutGrid />}
//       </button>

//       <AnimatePresence mode='wait'>
//         <motion.div
//           key={toggleViewMode ? "grid" : "list"}
//           initial="hidden"
//           animate="visible"
//           exit="exit"
//           variants={variants}
//           className={toggleViewMode ? "grid-container flex flex-wrap gap-10" : "list-container flex flex-wrap flex-col gap-10"}
//         >
//           {systems.map((system) => (
//             <motion.div
//               key={system.id}
//               className={toggleViewMode ? "grid-item flex-[1_1_30%]" : "list-item"}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               variants={variants}
//             >
//               <h3>{system.name}</h3>
//               <p>{system.description}</p>
//               <p>{system.price}</p>
//             </motion.div>
//           ))}
//         </motion.div>
//       </AnimatePresence>
//     </div>
//   );
// }

// export default GridList;


// abaixo um exemplo simples
// import React, { useState } from "react";
// import systems from "@/constants/systems";
// import { LayoutGrid, List } from "lucide-react";

// function GridList() {

//   const [toggleViewMode, setToggleViewMode] = useState(true);

//   return (
//     <div>
//       <button
//         className="px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
//         onClick={() => setToggleViewMode(!toggleViewMode)}
//       >
//         {toggleViewMode ? <List /> : <LayoutGrid />}
//       </button>

//       <div className={toggleViewMode ? "grid-container flex flex-wrap gap-10" : "list-container flex flex-wrap flex-col gap-10"}>
//         {systems.map((system) => (
//           <div
//             key={system.id}
//             className={toggleViewMode ? "grid-item flex-[1_1_30%]" : "list-item"}
//           >
//             <h3>{system.name}</h3>
//             <p>{system.description}</p>
//             <p>{system.price}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default GridList;
