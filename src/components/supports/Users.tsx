import React from "react";
import { OPTIONS } from "./options";
import { AnimatePresence } from "framer-motion";

export const Users = ({ selected }: { selected: number }) => {
  const { Content } = OPTIONS[selected];

  return (
    <div className="w-full mt-10 lg:-mt-[16px]">
      <AnimatePresence mode="wait">
        <Content key={selected} />
      </AnimatePresence>
    </div>
  );
};
