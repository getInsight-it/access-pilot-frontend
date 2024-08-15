"use client";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Eye } from "lucide-react";

export function ExpandableList() {
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

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="p-4 w-full max-w-[500px] relative h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-[#1f1f1f] sm:rounded-3xl overflow-hidden"
            >
              <motion.div className="absolute right-6 top-6" layoutId={`image-${active.title}-${id}`}>
                <Image
                  priority
                  width={200}
                  height={200}
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
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.div
                    layoutId={`button-${active.title}-${id}`}
                    
                    onClick={() => setActive(null)}
                    className="z-10 cursor-pointer absolute right-6 bottom-6 px-4 py-3 text-sm rounded-full font-bold bg-black dark:bg-white text-white dark:text-black"
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400  [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
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
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="p-4 grid grid-cols-[1fr_80px_60px] items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4  md:flex-row">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <Image
                  width={100}
                  height={100}
                  src={card.src}
                  alt={card.title}
                  className="h-8 w-8 md:h-10 md:w-10 rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="leading-snug">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-left"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  // layoutId={`description-${card.description}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-left">
                  {card.description}
                </motion.p>
              </div>
            </div>
            <div
              className={`px-2 py-1 text-xs font-medium rounded text-center w-20 inline-block justify-self-end ${
                card.status === "Aprovado"
                  ? "bg-green-200 text-green-800"
                  : card.status === "Rejeitado"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-slate-200 text-slate-800"
              }`}
            >
              {card.status}
            </div>
            
            <motion.button
              layoutId={`button-${card.title}-${id}`}
              className="grid items-center justify-center w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white md:mt-0 justify-self-end text-right"
            >
              {/* {card.ctaText} */}
              <Eye />
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
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description: "Administrador",
    title: "CRM",
    src: "/sistemas/sis01.svg",
    ctaText: "Detalhes",
    ctaLink: "#",
    status: "Pendente",
    content: () => {
      return (
        <div className="grid grid-cols-2 gap-5 py-6">
          <div className="font-bold space-y-3">
            {/* <p>Solicitação de acesso:</p> */}
            <p>Sistema:</p>
            <p>Função solicitada:</p>
            <p>Status:</p>
            <p>Data de envio:</p>
            <p>Solicitante:</p>
            <p>Gerente:</p>
            <p>Motivo do acesso:</p>
            {/* <p>Duração:</p> */}
          </div>
          <div className="space-y-3">
            {/* <p>REQ-2023-06-15-002</p> */}
            <p>CRM</p>
            <p>Administrador</p>
            <p>Em progresso</p>
            <p>15 de Junho, 2024</p>
            <p>José Maria</p>
            <p>Maria José</p>
            <p>Gerenciar sistema</p>
            {/* <p>3 Meses</p> */}
          </div>
        </div>
      );
    },
  },
  {
    description: "Gerente",
    title: "Painel de dados",
    src: "/sistemas/sis02.svg",
    ctaText: "Detalhes",
    ctaLink: "#",
    status: "Pendente",
    content: () => {
      return (
        <div className="grid grid-cols-2 gap-5 py-6">
          <div className="font-bold space-y-3">
            {/* <p>Solicitação de acesso:</p> */}
            <p>Sistema:</p>
            <p>Função solicitada:</p>
            <p>Status:</p>
            <p>Data de envio:</p>
            <p>Solicitante:</p>
            <p>Gerente:</p>
            <p>Motivo do acesso:</p>
            {/* <p>Duração:</p> */}
          </div>
          <div className="space-y-3">
            {/* <p>REQ-2023-06-15-002</p> */}
            <p>CRM</p>
            <p>Administrador</p>
            <p>Em progresso</p>
            <p>15 de Junho, 2024</p>
            <p>José Maria</p>
            <p>Maria José</p>
            <p>Gerenciar sistema</p>
            {/* <p>3 Meses</p> */}
          </div>
        </div>
      );
    },
  },

  {
    description: "Gerente",
    title: "Painel de análise",
    src: "/sistemas/sis03.svg",
    ctaText: "Detalhes",
    ctaLink: "#",
    status: "Aprovado",
    content: () => {
      return (
        <div className="grid grid-cols-2 gap-5 py-6">
          <div className="font-bold space-y-3">
            {/* <p>Solicitação de acesso:</p> */}
            <p>Sistema:</p>
            <p>Função solicitada:</p>
            <p>Status:</p>
            <p>Data de envio:</p>
            <p>Solicitante:</p>
            <p>Gerente:</p>
            <p>Motivo do acesso:</p>
            {/* <p>Duração:</p> */}
          </div>
          <div className="space-y-3">
            {/* <p>REQ-2023-06-15-002</p> */}
            <p>CRM</p>
            <p>Administrador</p>
            <p>Em progresso</p>
            <p>15 de Junho, 2024</p>
            <p>José Maria</p>
            <p>Maria José</p>
            <p>Gerenciar sistema</p>
            {/* <p>3 Meses</p> */}
          </div>
        </div>
      );
    },
  },
  {
    description: "Usuário",
    title: "Portal RH",
    src: "/sistemas/sis04.svg",
    ctaText: "Detalhes",
    ctaLink: "#",
    status: "Rejeitado",
    content: () => {
      return (
        <div className="grid grid-cols-2 gap-5 py-6">
          <div className="font-bold space-y-3">
            {/* <p>Solicitação de acesso:</p> */}
            <p>Sistema:</p>
            <p>Função solicitada:</p>
            <p>Status:</p>
            <p>Data de envio:</p>
            <p>Solicitante:</p>
            <p>Gerente:</p>
            <p>Motivo do acesso:</p>
            {/* <p>Duração:</p> */}
          </div>
          <div className="space-y-3">
            {/* <p>REQ-2023-06-15-002</p> */}
            <p>CRM</p>
            <p>Administrador</p>
            <p>Em progresso</p>
            <p>15 de Junho, 2024</p>
            <p>José Maria</p>
            <p>Maria José</p>
            <p>Gerenciar sistema</p>
            {/* <p>3 Meses</p> */}
          </div>
        </div>
      );
    },
  },
  
];