import React, { useState } from "react";
import { Tag } from "./Tag";
import { Detail } from "./Detail";

export const RequestDetail = ({
  data
}: {
  data: any;
}) => {
  const [selected, setSelected] = useState(3);
  // console.log(data);
  return (
    <section className="relative grid grid-cols-1 max-w-full lg:max-w-5xl items-start lg:grid-cols-2">
      <Detail selected={selected} setSelected={setSelected} data={data} />
      <Tag data={data} />
    </section>
  );
};
