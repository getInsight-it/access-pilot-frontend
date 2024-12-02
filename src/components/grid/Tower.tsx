import { CalloutChip } from "../utils/CalloutChip";
import { Card } from "../utils/Card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PulseLine } from "../../components/utils/PulseLine";
import { Grid, Home, Settings, User } from "lucide-react";

export const Tower = () => {
  return (
    <div className="col-span-1 h-[600px] lg:col-span-4 lg:h-[818px] 2xl:h-[842px]">
      <Card>
        <PulseLine />

        <CalloutChip>#1</CalloutChip>
        <p className="mb-2 text-2xl">Solicitações pendentes</p>
        <p className="mb-8 text-zinc-400">
          {/* Um ótimo lugar para fornecer uma análise de alto nível do que */}
          {/* seu sistema trata. Tente falar sobre benefícios em vez de recursos. */}
          Aqui, é possível acompanhar o status de cada solicitação e tomar as ações necessárias
          para garantir que os usuários tenham acesso aos sistemas.
        </p>

        <Mockup />
        
      </Card>
    </div>
  );
};

const Mockup = () => (
  <div className="absolute -bottom-4 left-6 h-[340px] w-full overflow-hidden rounded-xl border bg-[var(--mockup-bg-color)] lg:h-[470px]">
    <MockupTopBar />
    <div className="flex h-full w-full">
      <MockupSideBar />
      <MockupMain />
    </div>
  </div>
);

const MockupSideBar = () => (
  <div className="h-full w-24 border-r bg-[var(--sidebar-mockup-bg)] p-2">
    <div className="mb-4 flex items-center justify-between ">
      <Home className="text-zinc-700" />
      {/* <Bell className="text-blue-500" /> */}
    </div>
    <div className="space-y-2">
      <div className="flex items-center gap-1 rounded bg-primary px-1 py-0.5 text-xs text-primary-foreground">
        <User />
        Usuários
      </div>
      <div className="flex items-center gap-1 rounded px-1 py-0.5 text-xs text-zinc-600">
        {/* <Mail /> */}
        Admin
      </div>
      <div className="flex items-center gap-1 rounded px-1 py-0.5 text-xs text-zinc-600">
        <Settings />
        Sistemas
      </div>
      <div className="flex items-center gap-1 rounded px-1 py-0.5 text-xs text-zinc-600">
        <Grid className="w-4" />
        Papéis
      </div>
    </div>
  </div>
);

const MockupTopBar = () => (
  <div className="flex gap-1 border-b bg-primary p-2">
    <div className="size-2 rounded-full bg-red-600"></div>
    <div className="size-2 rounded-full bg-yellow-600"></div>
    <div className="size-2 rounded-full bg-green-600"></div>
  </div>
);

const MockupMain = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Diretor",
      // src: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      src: "/sistemas/sis01.svg",
    },
    {
      id: 2,
      name: "Gerente",
      src: "/sistemas/sis02.svg",
      // src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dan",
    },
    {
      id: 3,
      name: "Administrator",
      src: "/sistemas/sis03.svg",
      // src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
    },
    {
      id: 4,
      name: "Usuário",
      src: "/sistemas/sis04.svg",
      // src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andrea",
    },
    {
      id: 5,
      name: "Usuário",
      src: "/sistemas/sis05.svg",
      // src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pete",
    },
    {
      id: 6,
      name: "Usuário",
      src: "/sistemas/sis02.svg",
      // src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Phil",
    },
    {
      id: 7,
      name: "Usuário",
      src: "/sistemas/sis01.svg",
      // src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Garry",
    },
    {
      id: 8,
      name: "Usuário",
      src: "/sistemas/sis04.svg", 
      // src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Frank",
    },
    {
      id: 9,
      name: "Usuário",
      src: "/sistemas/sis04.svg",
      // src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Don",
    },
  ]);

  // useEffect(() => {
  //   const intervalRef = setInterval(() => {
  //     setUsers((pv) => {
  //       const copy = [...pv];
  //       const lastEl = copy.shift();

  //       if (lastEl) {
  //         copy.push(lastEl);
  //       }

  //       return copy;
  //     });
  //   }, 5000);

  //   return () => clearInterval(intervalRef);
  // }, []);

  useEffect(() => {
    const intervalRef = setInterval(() => {
      setUsers((pv) => {
        const copy = [...pv];
        const lastEl = copy.pop();  // Remove o último elemento da lista
  
        if (lastEl) {
          copy.unshift(lastEl);  // Adiciona o último elemento ao início da lista
        }
  
        return copy;
      });
    }, 5000);
  
    return () => clearInterval(intervalRef);
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative z-0 w-full p-4">
        <div className="w-full border-b pb-2 mb-3 text-xs font-semibold uppercase text-zinc-500">
          <span>Papel</span>
        </div>
        {users.map((u, i) => (
          <motion.div
            layout
            key={u.id}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            style={{
              zIndex: i === users.length - 1 ? 0 : 1,
            }}
            className="relative flex items-center gap-2 py-2 text-xs mb-1"
          >
            <motion.img
              animate={{
                scale: i === 0 ? 1.25 : 1,
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
              src={u.src}
              alt={`Placeholder image for faux user ${u.name}`}
              className="size-5 rounded-full"
            />
            <span className={i === 0 ? " text-primary" : "text-zinc-500"}>
              {u.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
