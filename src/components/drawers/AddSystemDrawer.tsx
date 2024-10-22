import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";
import useMeasure from "react-use-measure";
import {
  useDragControls,
  useMotionValue,
  useAnimate,
  motion,
} from "framer-motion";
import { SystemForm } from '../../components/forms/system-form';
import { Button, buttonVariants } from "../ui/button";
import { Plus } from "lucide-react";
import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";

export const AddSystemDrawer = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="grid place-content-center">

      <Link
        onClick={() => setOpen(true)}
        to={''}
        className={cn(buttonVariants({ variant: 'default' }))}
      >
        <Plus className="mr-2 h-4 w-4" /> Adicionar novo
      </Link>
      {/* <Button
        onClick={() => setOpen(true)}
        className=""
      >
        Adicionar nova
      </Button> */}

      <DragCloseDrawer open={open} setOpen={setOpen}>
        <div className="mx-auto  space-y-4 text-neutral-400">
          {/* <h2 className="text-4xl font-bold text-neutral-200">
            Drag the handle at the top of this modal downwards 100px to close it
          </h2>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minima
            laboriosam quos deleniti veniam est culpa quis nihil enim suscipit
            nulla aliquid iure optio quaerat deserunt, molestias quasi facere
            aut quidem reprehenderit maiores.
          </p> */}
          <SystemForm
            statuses={[
                { _id: 'Gerenciado', name: 'Gerenciado' },
                { _id: 'Não gerenciado', name: 'Não gerenciado' }
            ]}
            initialData={null}
            key={null}
          />
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
            <div className="left-0 right-0 top-0 z-10 flex justify-center bg-secondary p-6">
              <button
                onPointerDown={(e) => {
                  controls.start(e);
                }}
                className="h-2 w-14 cursor-grab touch-none rounded-full bg-neutral-700 active:cursor-grabbing"
              ></button>
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
