import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import systems from '../constants/sistemas';
import { LayoutGrid, List } from "lucide-react";
import { CardShine } from "./CardShine";

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
        <h2 className="mt-4 ml-1 font-bold text-xl">Sistemas que você tem acesso.</h2>
        <button
          className="
            font-bold
            grid
            items-center
            justify-center

            text-primary-foreground
            bg-primary

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
          className={toggleViewMode ? "grid-container lg:h-[343px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4" : "list-container list-none w-full lg:h-[343px] flex flex-col gap-2"}
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
              <CardShine>
                <div className={toggleViewMode ? "p-6" : " p-4"}>
                  {/* <div className="mt-4 absolute top-0 right-3">
                    <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                      {system.status}
                    </span>
                  </div> */}
                  <div className={toggleViewMode ? " " : "flex gap-4 items-end "}>
                    
                    {/* <img className={toggleViewMode ? "w-12" : "w-6"} src={system.url} alt="" /> */}
                    {/* <img
                      className={toggleViewMode ? "w-12" : "w-6"}
                      src={system.url}
                      alt="Imagem do sistema"
                    /> */}

                    <img
                      className={toggleViewMode ? "w-12" : "w-6"}
                      src={system.url ? system.url : "/ap.svg"} // Verifica se 'url' existe, senão usa uma imagem padrão
                      alt="Imagem do sistema"
                    />

                    <p className={`font-bold ${toggleViewMode ? "text-lg mt-3" : "text-md"}`}>{system.name}</p>
                    {/* <p className={`font-normal text-base text-neutral-200 ${toggleViewMode ? "mt-1" : " "}`}>
                      {system.role}
                    </p> */}
                    <p className={`font-normal text-base ${toggleViewMode ? "mt-1" : " "}`}>
  {system.role ? system.role : "Sem função atribuída"} {/* Verificação condicional para 'role' */}
</p>
                  </div>
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
