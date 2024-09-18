import React, { useState } from "react";
import { Users } from "./Users";
import { Copy } from "./Copy";

export const Supports = () => {
  const [selected, setSelected] = useState(3);

  return (
    <section className="relative grid grid-cols-1 max-w-full lg:max-w-5xl items-start lg:grid-cols-2 ">
      <Copy selected={selected} setSelected={setSelected} />
      <Users selected={selected} />
    </section>
  );
};
