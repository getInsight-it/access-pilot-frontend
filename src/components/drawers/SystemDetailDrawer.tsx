import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";
import useMeasure from "react-use-measure";
import {
  useDragControls,
  useMotionValue,
  useAnimate,
  motion,
} from "framer-motion";
import { RequestAccessForm } from "../forms/request-access-form";
import { Button, buttonVariants } from "../ui/button";
import { Clock, DoorClosed, Eye, Hand, Plus, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Supports } from "../supports/Supports";
import SystemDetail from "../canvas/system/SystemDetail";
import ToggleButton from "../toggle/ToggleButton";
import SystemPhone from "../canvas/system/SystemDetailPhone";
import { Link } from "react-router-dom";

export const SystemDetailDrawer = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="grid place-content-center">

      <Link
        onClick={() => setOpen(true)}
        to={''}
        className={cn(buttonVariants({ variant: 'link' }))}
      >
        <Eye className="mr-2 h-4 w-4" /> Ver detalhes
      </Link>
      {/* <Button
        onClick={() => setOpen(true)}
        className=""
      >
        Adicionar nova
      </Button> */}

      <DragCloseDrawer open={open} setOpen={setOpen}>
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2">
          
          <div className="w-full z-10 pointer-events-none">
        
            <div className="w-full max-w-[340px] mt-6 ml-6">

              <h2 className="mb-3 text-left text-2xl font-bold leading-tight md:text-2xl md:leading-tight">
                  Detlahes do sistema
              </h2>

              <div className="mt-6 mb-8 w-full grid grid-cols-1 gap-y-2">
                <p><span className="font-bold">Nome do sistema:</span><br /> CRM</p>
                <p><span className="font-bold">Descrição:</span><br /> Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea ullam sunt, voluptatum suscipit fuga id laudantium aut sint adipisci.</p>
                <p><span className="font-bold">Data de envio:</span><br /> 15/07/2024</p>
              </div>
            </div>

            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              className="ml-6"
            >
              <div className="flex gap-x-2">
                {/* <Clock className="w-5 h-5 text-red-500" /> */}
                <h2 className="text-lg font-bold mb-6">
                  Ações:
                </h2>
              </div>
              <div className="w-full flex gap-4 pointer-events-auto">
                <Button className="w-40 bg-yellow-200 text-yellow-800 hover:bg-yellow-800 hover:text-yellow-200" type="submit" onClick={() => {}}>
                  Despublicar
                </Button>
                <Button className="w-40 bg-blue-200 text-blue-800 hover:bg-blue-800 hover:text-blue-200" type="submit" onClick={() => {}}>
                  Editar
                </Button>
              </div>
              
              {/* <ToggleButton /> */}
            
            </motion.div>


          </div>
      
          <SystemDetail />
          {/* <SystemPhone /> */}
      
      
        </div>
      </DragCloseDrawer>
    </div>
  );
};

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children?: ReactNode;
}

const DragCloseDrawer = ({ open, setOpen, children }: Props) => {
  const [scope, animate] = useAnimate();
  const [drawerRef, { width }] = useMeasure();

  const x = useMotionValue(0);
  const controls = useDragControls();

  const handleClose = async () => {
    animate(scope.current, {
      opacity: [1, 0],
    });

    const xStart = typeof x.get() === "number" ? x.get() : 0;

    await animate("#drawer", {
      x: [xStart, width],
    });

    setOpen(false);
  };

  return (
    <>
      {open && (
        <motion.div
          ref={scope}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleClose}
          className="fixed inset-0 z-50 bg-neutral-950/70 dark:bg-neutral-950/75"
        >
          <motion.div
            id="drawer"
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            transition={{
              ease: "easeInOut",
            }}
            className="absolute right-0 bottom-0 w-full lg:w-auto h-full overflow-hidden rounded-tl-3xl bg-secondary"
            style={{ x }}
            drag="x"
            dragControls={controls}
            onDragEnd={() => {
              if (x.get() >= 100) {
                handleClose();
              }
            }}
            dragListener={false}
            dragConstraints={{
              left: 0,
              right: 0,
            }}
            dragElastic={{
              left: 0,
              right: 0.5,
            }}
          >
            
            <div className="left-0 border-b right-0 top-0 z-10 flex justify-between items-center bg-secondary p-6">
              <button
                onPointerDown={(e) => {
                  controls.start(e);
                }}
                className="h-6 w-6 cursor-grab touch-none rounded-full  active:cursor-grabbing"
              >
                <Hand className="w-6 h-6" />
              </button>
              <button
                onClick={handleClose}
                className=" cursor-pointer touch-none rounded-full  active:cursor-grabbing"
              >
                {/* <span className="
                  h-2 w-8
                  bg-red-700
                  absolute
                ">
                </span>
                <span className="
                  h-2 w-8
                  bg-red-700
                  rotate-90
                  absolute
                ">
                </span> */}
                <X className="h-8 w-8" />
              </button>
            </div>
            
            <div className="relative z-0 h-full overflow-y-auto  pt-0">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};


