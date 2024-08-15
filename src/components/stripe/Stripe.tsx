import { motion } from "framer-motion";
import { IconType } from "react-icons";
import { ArrowBigDown, ArrowBigUp, Bell, FolderDot, Home, Notebook, User } from "lucide-react";

export const Stripe = () => {
  return (
    <section className="absolute bottom-0 z-10 scale-[1.01] border-y-2  py-2 bg-white dark:bg-black">
      <div className="relative z-0 flex overflow-hidden ">
        <TranslateWrapper>
          <LogoItemsTop />
        </TranslateWrapper>
        <TranslateWrapper>
          <LogoItemsTop />
        </TranslateWrapper>
        <TranslateWrapper>
          <LogoItemsTop />
        </TranslateWrapper>
      </div>
      {/* <div className="relative z-0 flex overflow-hidden">
        <TranslateWrapper reverse>
          <LogoItemsBottom />
        </TranslateWrapper>
        <TranslateWrapper reverse>
          <LogoItemsBottom />
        </TranslateWrapper>
        <TranslateWrapper reverse>
          <LogoItemsBottom />
        </TranslateWrapper>
      </div> */}

      <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-32 bg-gradient-to-r from-white to-white/0 dark:from-black dark:to-black/0" />
      {/* <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-32 bg-gradient-to-l from-white to-white/0" /> */}
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
      initial={{ translateX: reverse ? "-100%" : "0%" }}
      animate={{ translateX: reverse ? "0%" : "-100%" }}
      transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      className="flex px-2"
    >
      {children}
    </motion.div>
  );
};

const LogoItem = ({ Icon, name }: { Icon: IconType; name: string }) => {
  return (
    <span className="flex items-center justify-center gap-3 px-4 py-2 md:py-0">
      <Icon className="text-2xl text-red-600 md:text-3xl" />
      <span className="whitespace-nowrap text-md text-[#1f1f1f] dark:text-[#dedede] font-semibold md:text-lg">
        {name}
      </span>
    </span>
  );
};

const LogoItemsTop = () => (
  <>
    <LogoItem Icon={FolderDot} name="26 sistemas" />
    <LogoItem Icon={Notebook} name="6 roles" />
    <LogoItem Icon={ArrowBigDown} name="10 usuários inativos" />
    <LogoItem Icon={ArrowBigUp} name="5 usuários ativos" />
    <LogoItem Icon={User} name="Total de 147 usuários registrados" />
    {/* <LogoItem Icon={Home} name="Home" />
    <LogoItem Icon={Home} name="Home" />
    <LogoItem Icon={Home} name="Home" />
    <LogoItem Icon={Home} name="Home" />
    <LogoItem Icon={Home} name="Home" /> */}
  </>
);

const LogoItemsBottom = () => (
  <>
    <LogoItem Icon={Home} name="Home" />
    <LogoItem Icon={Home} name="Home" />
    <LogoItem Icon={Home} name="Home" />
    <LogoItem Icon={Home} name="Home" />
    <LogoItem Icon={Home} name="Home" />
    <LogoItem Icon={Home} name="Home" />
    <LogoItem Icon={Home} name="Home" />
    <LogoItem Icon={Home} name="Home" />
    <LogoItem Icon={Home} name="Home" />
    <LogoItem Icon={Home} name="Home" />
  </>
);
