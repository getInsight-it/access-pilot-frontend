import {useEffect, useId, useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {useOutsideClick} from "../../hooks/use-outside-click";
import {Eye} from "lucide-react";
import {RequestDTO} from "../../services/request/request-d-t-o.ts";

interface ExpandableListProps {
  requests?: RequestDTO[]
}
const status = {
  "CREATED": {
    color: "bg-blue-500",
    icon: "FilePlus",
    description: "Criado"
  },
  "APPROVED": {
    color: "bg-green-200 text-green-800",
    icon: "Check",
    description: "Aprovado"
  },
  "REJECTED": {
    color: "bg-red-500",
    icon: "X",
    description: "Rejeitado"
  },
  "PENDING": {
    color: "bg-yellow-500",
    icon: "Clock",
    description: "Pendente"
  },
  "CANCELLED": {
    color: "bg-blue-500",
    icon: "Clock",
    description: "Cancelado"
  }
}

export function ExpandableList({requests}: ExpandableListProps) {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  );
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  function toCards(requests: RequestDTO[]) {
    return requests.map((request) => {
      return {
        title: request.role.client?.name,
        description: request.role.description,
        icon: request.role.icon,
        status: request.status,
        content: () => {
          return (
            <div className="grid grid-cols-2 gap-5 py-6">
              <div className="font-bold space-y-3">
                <p>Sistema:</p>
                <p>Função solicitada:</p>
                <p>Status:</p>
                <p>Data de envio:</p>
                <p>Solicitante:</p>
                <p>Aprovador:</p>
                <p>Motivo do acesso:</p>
              </div>
              <div className="space-y-3">
                <p>{request?.role.client?.name ?? 'N/A'}</p>
                <p>{request?.role.name ?? 'N/A'}</p>
                <p>{status[request?.status]?.description || 'N/A'}</p>
                <p>{new Date(request.criacao).toLocaleDateString('pt-BR') || 'N/A'}</p>
                <p>{request?.requestingUser?.username || 'N/A'}</p>
                <p>{request?.approvingUser?.username || 'N/A'}</p>
                <p>{request?.description || 'N/A'}</p>
              </div>
            </div>
          );
        },
      };
    });
  }

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute  lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon/>
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="p-4 w-full max-w-[500px] relative h-full md:h-fit md:max-h-[90%]  flex flex-col bg-secondary sm:rounded-3xl overflow-hidden"
            >
              <motion.div className="absolute right-6 top-6" layoutId={`image-${active.title}-${id}`}>
                <img
                  src={active.src}
                  alt={active.title}
                  className="
                    w-full
                    h-12
                    sm:rounded-tr-lg sm:rounded-tl-lg

                  "
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start px-4 pt-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-[var(--list-color)]"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-[var(--list-color)]"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.div
                    layoutId={`button-${active.title}-${id}`}

                    onClick={() => setActive(null)}
                    className="z-10 cursor-pointer absolute right-6 bottom-6 px-4 py-3 text-sm rounded-full font-bold bg-primary text-secondary"
                  >
                    {/* {active.ctaText} */}
                    Fechar
                    {/* {active ? active.ctaText : 'Texto alternativo'} */}
                  </motion.div>
                  {/* <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    {active.ctaText}
                  </motion.a> */}
                </div>
                <div className="pt-0 relative px-4">
                  <motion.div
                    layout
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    className="text-[var(--list-color)] text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto  [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <ul className="w-full gap-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="mt-1 ml-1 text-2xl">Últimas solicitações.</h2>
        </div>
        {requests && toCards(requests)?.map((card) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="px-0 py-4 md:px-4 md:py-4 grid grid-cols-[1fr_80px_60px] items-center hover:bg-secondary rounded-xl cursor-pointer"
          >
            <div className="flex gap-4  md:flex-row">
              <motion.div className="hidden md:block" layoutId={`image-${card.title}-${id}`}>
                <img
                  src={card?.src}
                  alt={card.title}
                  className="h-8 w-8 md:h-10 md:w-10 rounded-lg object-cover object-top "
                />
              </motion.div>
              <div className="leading-snug">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-[var(--list-color)] text-left"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  // layoutId={`description-${card.description}-${id}`}
                  className="text-[var(--list-color)] text-left">
                  {card.description}
                </motion.p>
              </div>
            </div>
            <div
              className={`px-2 py-1 text-xs font-medium rounded text-center w-20 inline-block justify-self-end ${
                card?.status === "APPROVED"
                  ? "bg-green-200 text-green-800"
                  : card.status === "REJECTED"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-slate-200 text-slate-800"
              }`}
            >
              {status[card?.status].description}
            </div>

            <motion.button
              layoutId={`button-${card.title}-${id}`}
              className="grid items-center justify-center w-10 h-10 rounded-full bg-primary text-secondary md:mt-0 justify-self-end text-right"
            >
              {/* {card.ctaText} */}
              <Eye/>
            </motion.button>

          </motion.div>
        ))}
      </ul>

    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M18 6l-12 12"/>
      <path d="M6 6l12 12"/>
    </motion.svg>
  );
};
