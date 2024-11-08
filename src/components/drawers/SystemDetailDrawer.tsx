import React, {Dispatch, ReactNode, SetStateAction, useState} from "react";
import useMeasure from "react-use-measure";
import {motion, useAnimate, useDragControls, useMotionValue,} from "framer-motion";
import {Button, buttonVariants} from "../ui/button";
import {Eye, Hand, X} from "lucide-react";
import {cn} from "../../lib/utils";
import SystemDetail from "../canvas/system/SystemDetail";
import {Link} from "react-router-dom";
import {clientService} from "../../services/client";
import {StepLoader} from "../steploader/StepLoader.tsx";
import {toast} from "../ui/use-toast.ts";
import {from, catchError, finalize, tap} from "rxjs";

export const SystemDetailDrawer = ({data}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);


  const handlePublish = () => {
    setLoading(true);
    from(clientService.publish(data.id)).pipe(
      tap((response) => {
        if (response) {
          toast({
            title: "Sistema publicado",
            description: "O sistema foi publicado com sucesso",
          });
        }
      }),
      catchError((error) => {
        toast({
          title: "Erro ao publicar sistema",
          description: "O sistema não foi publicado",
          variant: "destructive",
        });
        console.error(error);
        return [];
      }),
      finalize(() => setLoading(false))
    ).subscribe();
  };

  const handleUnpublish = () => {
    setLoading(true);
    from(clientService.unpublish(data.id)).pipe(
      tap((response) => {
        if (response) {
          toast({
            title: "Sistema despublicado",
            description: "O sistema foi despublicado com sucesso",
          });
        }
      }),
      catchError((error) => {
        toast({
          title: "Erro ao despublicar sistema",
          description: "O sistema não foi despublicado",
          variant: "destructive",
        });
        console.error(error);
        return [];
      }),
      finalize(() => setLoading(false))
    ).subscribe();
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'Publicado';
      case 'UNPUBLISHED':
        return 'Não Publicado';
      default:
        return status;
    }
  };

  function handleLoaderClose() {
    setLoading(false);
  }

  return (
    <div className="grid place-content-center">

      <Link
        onClick={() => setOpen(true)}
        to={''}
        className={cn(buttonVariants({variant: 'link'}))}
      >
        <Eye className="mr-2 h-4 w-4"/> Ver detalhes
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
                <p><span className="font-bold">Nome do sistema:</span><br/>{data?.name}</p>
                <p><span className="font-bold">Client Id:</span><br/>{data?.clientId}</p>
                <p><span className="font-bold">Descrição:</span><br/> {data?.description}</p>
                <p><span className="font-bold">Gerenciado:</span><br/> {data?.managed ? 'Sim' : 'Não'}</p>
                <p><span className="font-bold">Status:</span><br/> {formatStatus(data?.status)}</p>
              </div>
            </div>

            <motion.div
              initial={{y: 12, opacity: 0}}
              animate={{y: 0, opacity: 1}}
              exit={{y: -12, opacity: 0}}
              className="ml-6"
            >
              <div className="flex gap-x-2">
                <h2 className="text-lg font-bold mb-6">
                  Ações:
                </h2>
              </div>
              <div className="w-full flex gap-4 pointer-events-auto">
                {data.status === 'PUBLISHED' ?
                  <Button className="w-40 bg-yellow-200 text-yellow-800 hover:bg-yellow-800 hover:text-yellow-200"
                          type="submit" onClick={handleUnpublish}>Despublicar

                  </Button> :
                  <Button className="w-40 bg-green-200 text-green-800 hover:bg-green-800 hover:text-green-200"
                          type="submit" onClick={handlePublish}>
                    Publicar
                  </Button>}
              </div>
            </motion.div>
          </div>
          <SystemDetail/>
        </div>
      </DragCloseDrawer>
      <StepLoader loading={loading} onClose={handleLoaderClose}/>
    </div>
  );
};

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children?: ReactNode;
}

const DragCloseDrawer = ({open, setOpen, children}: Props) => {
  const [scope, animate] = useAnimate();
  const [drawerRef, {width}] = useMeasure();

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
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          onClick={handleClose}
          className="fixed inset-0 z-50 bg-neutral-950/70 dark:bg-neutral-950/75"
        >
          <motion.div
            id="drawer"
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
            initial={{x: "100%"}}
            animate={{x: "0%"}}
            transition={{
              ease: "easeInOut",
            }}
            className="absolute right-0 bottom-0 w-full lg:w-auto h-full overflow-hidden rounded-tl-3xl bg-secondary"
            style={{x}}
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
                <Hand className="w-6 h-6"/>
              </button>
              <button
                onClick={handleClose}
                className=" cursor-pointer touch-none rounded-full  active:cursor-grabbing"
              >
                <X className="h-8 w-8"/>
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
