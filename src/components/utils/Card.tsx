import React, { CSSProperties, ReactNode } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

export const Card = ({
  className,
  children,
  style = {},
}: {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}) => {
  return (
    <motion.div
      initial={{
        filter: "blur(2px)",
      }}
      whileInView={{
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
        delay: 0.25,
      }}
      style={style}
      className={twMerge(
        "relative h-full w-full overflow-hidden rounded-2xl border bg-gradient-to-br from-gray-100/10 to-gray-200/10 dark:from-zinc-950/50 dark:to-zinc-900/80 p-6",
        className
      )}
    >
      {children}
    </motion.div>
  );
};
