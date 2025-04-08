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
