import {motion} from "framer-motion";
import {LucideProps, ArrowBigDown, ArrowBigUp, FolderDot, Notebook, User} from "lucide-react";

// Atualizando o tipo Icon para LucideProps
const LogoItem = ({ Icon, name }: { Icon: React.FunctionComponent<LucideProps>; name: string }) => {
  return (
    <span className="flex items-center justify-center gap-3 px-4 py-2 md:py-0">
      <Icon className="text-2xl text-[var(--stripe-iconcolor)] md:text-3xl" />
      <span className="whitespace-nowrap text-md text-[var(--stripe-text)] font-regular md:text-lg">
        {name}
      </span>
    </span>
  );
};

export const Stripe = ({summary}) => {
  return (
    <section className="absolute bottom-0 z-10 scale-[1.01] border py-2 bg-[var(--stripe-bg)]">
      <div className="relative z-0 flex overflow-hidden ">
        <TranslateWrapper>
          <LogoItemsTop summary={summary} />
        </TranslateWrapper>
        <TranslateWrapper>
          <LogoItemsTop summary={summary} />
        </TranslateWrapper>
        <TranslateWrapper>
          <LogoItemsTop summary={summary}  />
        </TranslateWrapper>
      </div>
    </section>
  );
};

const TranslateWrapper = ({
                            children,
                            reverse,
                          }: {
  children: JSX.Element;
  reverse?: boolean;
}) => {
  return (
    <motion.div
      initial={{translateX: reverse ? "-100%" : "0%"}}
      animate={{translateX: reverse ? "0%" : "-100%"}}
      transition={{duration: 50, repeat: Infinity, ease: "linear"}}
      className="flex px-2"
    >
      {children}
    </motion.div>
  );
};


const LogoItemsTop = ({summary}) => (
  <>
    <LogoItem Icon={FolderDot} name={`${summary?.totalClients} sistemas`} />
    <LogoItem Icon={Notebook} name={`${summary?.totalRoles} papéis`}/>
    <LogoItem Icon={ArrowBigDown} name={`${summary?.totalInactiveUsers} usuários inativos`}/>
    <LogoItem Icon={ArrowBigUp} name={`${summary?.totalActiveUsers} usuários ativos`}/>
    <LogoItem Icon={User} name={`Total de ${summary?.totalPendingUsers} solicitações pendentes`}/>
    <LogoItem Icon={User} name={`Total de ${summary?.totalRegisteredUsers} usuários registrados`}/>
  </>
);
