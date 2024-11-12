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
import { DoorClosed, Eye, Hand, Plus, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";
import { RequestDetail } from "../request-detail/RequestDetail";
import { RowExpanding } from "@tanstack/react-table";

export const DetailDrawer = ({data}) => {
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

      <DragCloseDrawer open={open} setOpen={setOpen}>
        <RequestDetail data={data} />
        
        {/* <div className="">  
          <p><span className="font-bold">Nome do sistema:</span><br/>{data?.role.client.name}</p>
          <p><span className="font-bold">Data de envio:</span><br/>{data?.criacao}</p>
          <p><span className="font-bold">Função:</span><br/>{data?.role.name}</p>
          <p><span className="font-bold">Motivo do acesso:</span><br/> {data?.description}</p>
          <p><span className="font-bold">Solicitante:</span><br/> {data?.requestingUser.firstName}</p>
          <p><span className="font-bold">Gerenciado:</span><br/> {data?.managed ? 'Sim' : 'Não'}</p>
          <p><span className="font-bold">Status:</span><br/> {data?.status}</p>  
        </div> */}

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
                className="block md:hidden h-6 w-6 cursor-grab touch-none rounded-full  active:cursor-grabbing"
              >
                <Hand className="w-6 h-6"/>
              </button>
              <button
                onClick={handleClose}
                className=" cursor-pointer touch-none rounded-full  active:cursor-grabbing"
              >
                <X className="h-8 w-8" />
              </button>
            </div>
            <div className="relative z-0 h-full overflow-y-auto p-8 pt-0">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
