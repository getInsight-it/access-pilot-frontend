import {
    motion,
    MotionConfig,
  } from "framer-motion";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
  import React, {
    Dispatch,
    SetStateAction,
    useState,
    MouseEventHandler,
  } from "react";
  import { twMerge } from "tailwind-merge";
  
  export const Hero  = () => {
    const [idx, setIdx] = useState(0);
  
    return (
      <div className="relative ">
        <div className=" w-full flex flex-col justify-between">
          <div className="relative h-[276px] overflow-hidden md:h-[315px]">
            {CONTENT.map((c, itemIdx) => {
              return (
                <motion.div
                  initial={false}
                  animate={{
                    opacity: idx === itemIdx ? 1 : 0,
                    y: idx === itemIdx ? 0 : 24,
                    filter: idx === itemIdx ? "blur(0px)" : "blur(2px)",
                  }}
                  transition={{
                    ease: "easeInOut",
                    duration: 0.3,
                  }}
                  style={{
                    pointerEvents: idx === itemIdx ? "all" : "none",
                  }}
                  className="absolute inset-0 z-10 grid place-content-center space-y-3 px-6 text-base font-light leading-relaxed text-neutral-400 md:px-12 md:text-lg"
                  key={itemIdx}
                >
                  {c.content}
                </motion.div>
              );
            })}
    
            <span className="pointer-events-none absolute -right-0 bottom-0 z-0 text-7xl text-gray-200 dark:text-neutral-800">
              {idx + 1}/{CONTENT.length}
            </span>
          </div>
    
          <Buttons idx={idx} setIdx={setIdx} />
        </div>
      </div>
    );
  };
  
  const Buttons = ({
    idx,
    setIdx,
  }: {
    idx: number;
    setIdx: Dispatch<SetStateAction<number>>;
  }) => {
    return (
      <div className="relative grid h-[57px] grid-cols-2 border-t ">
        <ShiftButton
          onClick={() => {
            setIdx((pv) => {
              if (pv === 0) {
                return CONTENT.length - 1;
              } else {
                return pv - 1;
              }
            });
          }}
          topDivClasses="bg-white dark:bg-neutral-900"
          bottomDivClasses="bg-white dark:bg-neutral-950"
        >
          <ArrowLeft className="mx-auto text-xl" />
        </ShiftButton>
        <ShiftButton
          topDivClasses="bg-white dark:bg-neutral-900"
          btnClasses=" border-l"
          bottomDivClasses="bg-white dark:bg-neutral-950"
          onClick={() => {
            setIdx((pv) => {
              if (pv === CONTENT.length - 1) {
                return 0;
              } else {
                return pv + 1;
              }
            });
          }}
        >
          <ArrowRight className="mx-auto text-xl" />
        </ShiftButton>
  
        <motion.span
          key={idx}
          initial={{
            width: "0%",
          }}
          animate={{
            width: "100%",
          }}
          transition={{
            duration: 12,
            ease: "linear",
          }}
          onAnimationComplete={() => {
            setIdx((pv) => {
              if (pv === CONTENT.length - 1) {
                return 0;
              } else {
                return pv + 1;
              }
            });
          }}
          className="pointer-events-none absolute -top-[1px] bottom-0 z-20 bg-neutral-600/10"
        />
      </div>
    );
  };
  
  const ShiftButton = ({
    onClick,
    children,
    btnClasses,
    topDivClasses,
    bottomDivClasses,
  }: {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
    btnClasses?: string;
    topDivClasses?: string;
    bottomDivClasses?: string;
  }) => {
    return (
      <MotionConfig
        transition={{
          ease: "circOut",
          duration: 0.25,
        }}
      >
        <motion.button
          initial="initial"
          whileHover="hovered"
          className={twMerge(
            "relative overflow-hidden transition-colors",
            btnClasses
          )}
          onClick={onClick}
        >
          <motion.div
            variants={{
              initial: {
                y: "0%",
              },
              hovered: {
                y: "-100%",
              },
            }}
            className={twMerge(
              "grid h-full place-content-center bg-neutral-950",
              topDivClasses
            )}
          >
            {children}
          </motion.div>
          <motion.div
            variants={{
              initial: {
                y: "100%",
              },
              hovered: {
                y: "0%",
              },
            }}
            className={twMerge(
              "absolute inset-0 grid h-full place-content-center",
              bottomDivClasses
            )}
          >
            {children}
          </motion.div>
        </motion.button>
      </MotionConfig>
    );
  };
  
  const CONTENT = [
    {
      content: (
        <>
        {/* <img className="w-24" src="/helmet3d.png" /> */}
          <p>
            <span className="text-black dark:text-white">Tempo médio de resposta para aprovações de acesso. 👋</span>{" "}
            {/* <a href="#" className="text-emerald-300 hover:underline">
              Tempo médio de resposta para aprovações de acesso.{" "}
            </a> */}
            3h:15
          </p>
        </>
      ),
    },
    {
      content: (
        <>
        <p>
          Sistemas com maior número de solicitações de acesso.
        </p>
          {/* <p>
            
            Lorem ipsum dolor sit amet tou uor{" "}
            <span className="text-black dark:text-white">ipsum</span> dolor amet.
          </p>
          <p>
          Donec nec ex nec odio lobortis vestibulum in eget purus.
          Etiam rutrum maximus turpis.
          </p> */}
        </>
      ),
    },
    {
      content: (
        <>
        <p>
          Lista de roles com maior número de usuários.
        </p>
        <ul>
          <li>
            Administrador(58)
          </li>
          <li>
            Usuário(46)
          </li>
          <li>
            Administrador(33)
          </li>
        </ul>
          {/* <p>
            We integrate directly with <span className="text-black dark:text-white">Shopify</span>{" "}
            <Home className="inline text-green-400" /> Donec nec ex nec odio lobortis
            vestibulum in eget purus. Etiam rutrum.
          </p> */}
        </>
      ),
    },
    {
      content: (
        <>
        <p>
          Disponibilidade do sistema.
        </p>
          {/* <p>
            <span className="text-black dark:text-white">Lorem ipsum?</span> Dolor sit amet{" "}
            <span className="hidden md:inline">doner no odio</span>
            <span className="inline md:hidden">dolor</span> interdum et malesuada fames
            ac ante ipsum primis in faucibus 🚀
          </p> */}
        </>
      ),
    },
  ];