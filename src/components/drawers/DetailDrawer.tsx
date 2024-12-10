import React, {Dispatch, ReactNode, SetStateAction, useEffect, useState} from "react";
import useMeasure from "react-use-measure";
import {motion, useAnimate, useDragControls, useMotionValue,} from "framer-motion";
import {Hand, X} from "lucide-react";
import {RequestDetail} from "../request-detail/RequestDetail";
import useAuthStore from "../../store/authStore";
import {storageService} from "../../services/storage";
import {RequestDTO} from "../../services/request/request-d-t-o.ts";
import {StorageDTO} from "../../services/storage/storage-dto.ts";

interface DetailDrawerProps {
  onUpdate?: () => void
  data: RequestDTO;
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({data, onUpdate}) => {

  const [open, setOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [storages, setStorages] = useState<StorageDTO[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageCount] = useState(100); // pode alterar a contagem de páginas conforme necessário
  const [page, setPage] = useState(1);

  const getStorageData = async (ownerId, pageIndex, pageCount) => {
    const pageResponse = await storageService.getStoragesPaginated(ownerId, pageIndex, pageCount, "id", "asc");
    setStorages(pageResponse?.items || []);
    setTotalItems(pageResponse?.total ?? 0);
  };


  const handleAttachments = (ownerId: string) => {
    if (isAuthenticated) {
      getStorageData(ownerId, page, pageCount);
      setOpen(true);
    }
  }

  useEffect(() => {
    if (data?.uuid) {
      handleAttachments(data?.uuid);
    }
  }, [data, isAuthenticated]);

  return (
    <div className="grid place-content-center">

      <DragCloseDrawer open={open} setOpen={setOpen}>

        <RequestDetail attachments={storages} data={data} onUpdate={onUpdate}/>

      </DragCloseDrawer>
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
                className="block md:hidden h-6 w-6 cursor-grab touch-none rounded-full  active:cursor-grabbing"
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
            <div className="relative z-0 h-full overflow-y-auto p-8 pt-0">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
