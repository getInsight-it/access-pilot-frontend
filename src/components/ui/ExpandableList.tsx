import { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useOutsideClick } from "../../hooks/use-outside-click"
import { Eye, X } from "lucide-react"
import type { RequestDTO } from "../../services/request/request-d-t-o.ts"
import IconRenderer from "../icons/IconRenderer.tsx"
import { TruncatedDescription } from "../TruncateDescription.tsx"
import { useNavigate } from "react-router-dom"

interface ExpandableListProps {
  requests?: RequestDTO[]
}

const status = {
  CREATED: {
    color: "bg-blue-200 text-blue-800 block w-32",
    icon: "FilePlus",
    description: "Criado",
  },
  APPROVED: {
    color: "bg-green-200 text-green-800 block w-32",
    icon: "Check",
    description: "Aprovado",
  },
  REJECTED: {
    color: "bg-red-200 text-red-800 block w-32",
    icon: "X",
    description: "Rejeitado",
  },
  PENDING: {
    color: "bg-blue-200 text-blue-800 block w-32",
    icon: "Clock",
    description: "Pendente",
  },
  CANCELLED: {
    color: "bg-gray-200 text-gray-800 block w-32",
    icon: "Clock",
    description: "Cancelado",
  },
}

export function ExpandableList({ requests }: ExpandableListProps) {
  const [active, setActive] = useState<RequestDTO | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  const navigate = useNavigate();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null)
      }
    }

    if (active) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [active])

  useOutsideClick(ref, () => setActive(null))

  function renderContent(request: RequestDTO) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-[150px,1fr] gap-4 py-6">
        <div className="font-bold space-y-3">
          <p>Sistema:</p>
          <p>Papel solicitado:</p>
          <p>Status:</p>
          <p>Data de envio:</p>
          <p>Solicitante:</p>
          <p>Aprovador:</p>
          <p>Motivo do acesso:</p>
        </div>
        <div className="space-y-3">
          <p>{request.role.client?.name ?? "N/A"}</p>
          <p className="capitalize flex gap-x-4">
            <motion.span className="" layoutId={`image-${active.id}-${id}`}>
              <IconRenderer className={`${active.role.icon} h-5 w-5`} />
            </motion.span>
            {request.role.name ?? "N/A"}
          </p>
          <div
            className={`px-2 py-1 text-xs font-medium rounded text-center w-20 inline-block justify-self-end ${
              status[request.status].color
            }`}
          >
            <p>{status[request?.status]?.description || "N/A"}</p>
          </div>
          <p>{new Date(request.criacao).toLocaleDateString("pt-BR") || "N/A"}</p>
          <p>{request.requestingUser?.username || "N/A"}</p>
          <p>{request.approvingUser?.username || "N/A"}</p>
          <TruncatedDescription fontSize="text-md" maxLength={80} description={request.description ? request.description : "Sem descrição"}/>
        </div>
      </div>
    )
  }

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-close-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute hidden z-50 items-start justify-center bg-red-500 rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
              className="p-4 w-full max-w-[540px] relative h-full md:h-fit md:max-h-[90%] flex flex-col bg-secondary sm:rounded-3xl overflow-hidden"
            >
              {/* <motion.div className="absolute right-6 top-6" layoutId={`image-${active.id}-${id}`}>
                <IconRenderer className={`${active.role.icon} h-6 w-6`} />
              </motion.div> */}

              <div>
                <div className="flex justify-between items-start px-4 pt-4">

                  <div>
                    <motion.h3 layoutId={`title-${active.id}-${id}`} className="font-bold text-[var(--list-color)]">
                      {active.role.client?.name}
                    </motion.h3>
                    <motion.p layoutId={`description-${active.id}-${id}`} className="text-[var(--list-color)]">
                      {active.role.description}
                    </motion.p>                    
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => navigate(`/dashboard/access-requests/${active.id}`, { state: { origin: origin } })}
                    className="z-10 cursor-pointer absolute right-6 bottom-6 px-4 py-3 text-sm rounded-full font-bold bg-primary text-secondary"
                  >
                    Ir para a solicitação
                  </motion.div>
                  <motion.div
                    layoutId={`button-${active.id}-${id}`}
                    onClick={() => setActive(null)}
                    className="z-10 cursor-pointer absolute right-6 top-6 p-3 text-sm rounded-full font-bold bg-primary text-secondary"
                  >
                    <X className="h-4 w-4" />
                  </motion.div>
                </div>
                <div className="pt-0 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[var(--list-color)] text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {renderContent(active)}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ul className="w-full gap-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="mt-1 ml-1 text-2xl">Últimas solicitações.</h2>
        </div>
        {requests?.map((request) => (
          <motion.div
            layoutId={`card-${request.id}-${id}`}
            key={`card-${request.id}-${id}`}
            onClick={() => setActive(request)}
            className="px-0 py-4 md:px-4 md:py-4 grid grid-cols-[1fr_80px_60px] items-center hover:bg-secondary rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 md:flex-row">
              <motion.div className="hidden md:block" layoutId={`image-${request.id}-${id}`}>
                
                {/* <img
                  src={request.role.icon || "/img/ap.svg"}
                  alt={request.role.name}
                  className="h-8 w-8 md:h-10 md:w-10 rounded-lg object-cover object-top"
                /> */}

                <IconRenderer className={`${request.role.icon} h-6 w-6 rounded-lg object-cover object-top`} />

              </motion.div>
              <div className="leading-snug">
                <motion.h3
                  layoutId={`title-${request.id}-${id}`}
                  className="font-medium text-[var(--list-color)] text-left"
                >
                  {request.role.client?.name}
                </motion.h3>
                <motion.p className="text-[var(--list-color)] text-left capitalize">{request.role.name}</motion.p>
                <motion.p className="text-[var(--list-color)] text-left">{request.role.description}</motion.p>
              </div>
            </div>
            <div
              className={`px-2 py-1 text-xs font-medium rounded text-center w-20 inline-block justify-self-end ${
                status[request.status].color
              }`}
            >
              {status[request.status].description}
            </div>

            <motion.button
              layoutId={`button-${request.id}-${id}`}
              className="grid items-center justify-center w-10 h-10 rounded-full bg-primary text-secondary md:mt-0 justify-self-end text-right"
            >
              <Eye />
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </>
  )
}

const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
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
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  )
}
