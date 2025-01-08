import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import systems from "../constants/sistemas";
import { Check, LayoutGrid, List, MonitorIcon } from "lucide-react";
import { CardShine } from "./CardShine";
import { Button } from "./ui/button";
import { clientService } from "../services/client";
import useAuthStore from "../store/authStore";

interface Client {
  id: number;
  clientId: string;
  description: string;
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

function GridListNoAccess() {

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
      const fetchedClients = await clientService.getClients();
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
      <div className="flex items-center justify-betweenmb-4 pr-2">
        {/* <h2 className="mt-4 ml-1 font-bold text-xl">Sistemas que você pode solicitar acesso.</h2>
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
        </button> */}
      </div>

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
                  {/* <Check className="absolute top-6 right-6" /> */}

                  <div className="flex flex-row items-center">
                    <MonitorIcon className="w-6 h-6 mr-4" />
                    <p className="font-bold text-lg">
                      {client.clientId}
                    </p>
                  </div>
                  
                  <p className="mt-1 text-sm">
                    {client.description ? client.description : "Sem função atribuída"}
                  </p>
                </div>
                <Button className={toggleViewMode ? "mt-0 relative bg-primary text-primary-foreground w-full rounded-[var(--card-border-radius)] rounded-t-none" : "mt-2.5 absolute right-4 top-0 bg-primary text-primary-foreground"}>
                  Solicitar acesso
                </Button>
                
              </CardShine>

              {/* <CardShine>
                <div className={toggleViewMode ? "p-4" : " p-4"}>
                  <div className={toggleViewMode ? " " : "flex gap-4 items-end "}>

                    <img
                      className={toggleViewMode ? "w-12" : "w-6"}
                      src="/sistemas/sis01.svg"
                      alt="Imagem do sistema"
                    />

                    <div className="flex flex-row items-center space-x-4">
                      <MonitorIcon className={toggleViewMode ? "w-8" : "w-6"} />
                      <div className="flex flex-col">
                        <p className={`font-bold relative leading-6 ${toggleViewMode ? "text-lg" : "text-md"}`}>
                          {client.clientId}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row items-center space-x-4">
                      <MonitorIcon className={toggleViewMode ? "w-8" : "w-6"} />
                      <div className="flex flex-col">
                        <p className={`${toggleViewMode ? "text-sm mt-3" : "text-md"}`}>
                          {client.description}
                        </p>
                      </div>
                    </div>

                    <div className="ml-0">
                      <p className={`${toggleViewMode ? "text-sm mt-3" : "text-md"}`}>
                        {client.description}
                      </p>
                    </div>

                  </div>
                  

                </div>
                  
                  <Button className={toggleViewMode ? "mt-0 relative bg-primary text-primary-foreground w-full rounded-[var(--card-border-radius)] rounded-t-none" : "mt-2.5 absolute right-4 top-0 bg-primary text-primary-foreground"}>
                    Solicitar acesso
                  </Button>

              </CardShine> */}

             

                {/* {clients.map((client, index) => (
                  <div key={index}>
                    {client.clientId}
                  </div>
                ))} */}

            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default GridListNoAccess;

