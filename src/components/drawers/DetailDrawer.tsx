// import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
// import useMeasure from "react-use-measure";
// import {
//   useDragControls,
//   useMotionValue,
//   useAnimate,
//   motion,
// } from "framer-motion";
// import { RequestAccessForm } from "../forms/request-access-form";
// import { Button, buttonVariants } from "../ui/button";
// import { DoorClosed, Eye, Hand, Plus, X } from "lucide-react";
// import { cn } from "../../lib/utils";
// import { Link } from "react-router-dom";
// import { RequestDetail } from "../request-detail/RequestDetail";
// import { RowExpanding } from "@tanstack/react-table";
// import useAuthStore from "../../store/authStore";
// import { StorageDTO } from "../../services/storage/storage-dto";
// import { storageService } from "../../services/storage";

// export const DetailDrawer = ({data}) => {
//   const [open, setOpen] = useState(false);
  
//   // console.log(data)


//   const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
//   const [storages, setStorages] = useState<StorageDTO[]>([]);
//   const [totalItems, setTotalItems] = useState(0);
//   const [pageCount, setPageCount] = useState(10);
//   const [page, setPage] = useState(0);

//   const init = () => {
//     getStorageData(page, pageCount);
//   };

//   const getStorageData = async (page, pageCount) => {
//     // const pageResponse = await storageService.getStoragesPaginated(page, pageCount, 'id', 'asc');
//     // setStorages(pageResponse?.items || []);
//     // setTotalItems(pageResponse?.total ?? 0);
//     console.log(storages)
//   };


//   useEffect(() => {
//     if (isAuthenticated) {
//       init();
//     }
//   }, [isAuthenticated]);


//   return (
//     <div className="grid place-content-center">

//       <Link
//         onClick={() => setOpen(true)}
//         to={''}
//         className={cn(buttonVariants({ variant: 'link' }))}
//       >
//         <Eye className="mr-2 h-4 w-4" /> Ver detalhes
//       </Link>

//       <DragCloseDrawer open={open} setOpen={setOpen}>
//         <RequestDetail data={data} />
//       </DragCloseDrawer>
//     </div>
//   );
// };

// interface Props {
//   open: boolean;
//   setOpen: Dispatch<SetStateAction<boolean>>;
//   children?: ReactNode;
// }

// const DragCloseDrawer = ({ open, setOpen, children }: Props) => {
//   const [scope, animate] = useAnimate();
//   const [drawerRef, { width }] = useMeasure();

//   const x = useMotionValue(0);
//   const controls = useDragControls();

//   const handleClose = async () => {
//     animate(scope.current, {
//       opacity: [1, 0],
//     });

//     const xStart = typeof x.get() === "number" ? x.get() : 0;

//     await animate("#drawer", {
//       x: [xStart, width],
//     });

//     setOpen(false);
//   };

//   return (
//     <>
//       {open && (
//         <motion.div
//           ref={scope}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           onClick={handleClose}
//           className="fixed inset-0 z-50 bg-neutral-950/70 dark:bg-neutral-950/75"
//         >
//           <motion.div
//             id="drawer"
//             ref={drawerRef}
//             onClick={(e) => e.stopPropagation()}
//             initial={{ x: "100%" }}
//             animate={{ x: "0%" }}
//             transition={{
//               ease: "easeInOut",
//             }}
//             className="absolute right-0 bottom-0 w-full lg:w-auto h-full overflow-hidden rounded-tl-3xl bg-secondary"
//             style={{ x }}
//             drag="x"
//             dragControls={controls}
//             onDragEnd={() => {
//               if (x.get() >= 100) {
//                 handleClose();
//               }
//             }}
//             dragListener={false}
//             dragConstraints={{
//               left: 0,
//               right: 0,
//             }}
//             dragElastic={{
//               left: 0,
//               right: 0.5,
//             }}
//           >
//             <div className="left-0 border-b right-0 top-0 z-10 flex justify-between items-center bg-secondary p-6">
//               <button
//                 onPointerDown={(e) => {
//                   controls.start(e);
//                 }}
//                 className="block md:hidden h-6 w-6 cursor-grab touch-none rounded-full  active:cursor-grabbing"
//               >
//                 <Hand className="w-6 h-6"/>
//               </button>
//               <button
//                 onClick={handleClose}
//                 className=" cursor-pointer touch-none rounded-full  active:cursor-grabbing"
//               >
//                 <X className="h-8 w-8" />
//               </button>
//             </div>
//             <div className="relative z-0 h-full overflow-y-auto p-8 pt-0">
//               {children}
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </>
//   );
// };








import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
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
import useAuthStore from "../../store/authStore";
import { StorageDTO } from "../../services/storage/storage-dto";
import { storageService } from "../../services/storage";

export const DetailDrawer = ({data}) => {
  // const [open, setOpen] = useState(false);
  // const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  // const [storages, setStorages] = useState<StorageDTO[]>([]);
  // const [totalItems, setTotalItems] = useState(0);
  // const [pageCount, setPageCount] = useState(10);
  // const [page, setPage] = useState(0);

  // const init = () => {
  //   getStorageData(page, pageCount);
  // };

  // const getStorageData = async (page, pageCount) => {
  //   const pageResponse = await storageService.getStoragesPaginated(page, pageCount, 'id', 'asc');
  //   setStorages(pageResponse?.items || []);
  //   setTotalItems(pageResponse?.total ?? 0);
  //   console.log(pageResponse)
  // };

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     init();
  //   }
  // }, [isAuthenticated]);

  const [open, setOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [storages, setStorages] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageCount] = useState(100); // pode alterar a contagem de páginas conforme necessário
  const [page, setPage] = useState(1);

  const getStorageData = async (ownerId, pageIndex, pageCount) => {
    const pageResponse = await storageService.getStoragesPaginated(ownerId, pageIndex, pageCount, "id", "asc");
      setStorages(pageResponse.items);
      setTotalItems(pageResponse?.total ?? 0);
  };


  const handleAttachments = (ownerId: string) => {
    if (isAuthenticated) {
      getStorageData(ownerId, page, pageCount);
      setOpen(true);
    }
  }

  return (
    <div className="grid place-content-center">

      <Link
        onClick={() => handleAttachments(data?.uuid)}
        to={''}
        className={cn(buttonVariants({ variant: 'link' }))}
      >
        <Eye className="mr-2 h-4 w-4" /> Ver detalhes
      </Link>
      

      <DragCloseDrawer open={open} setOpen={setOpen}>

        <RequestDetail attachments={storages} data={data} />
      
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
