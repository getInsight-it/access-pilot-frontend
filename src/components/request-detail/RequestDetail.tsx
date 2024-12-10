import React, { useState } from "react";
import { Tag } from "./Tag";
import { Detail } from "./Detail";
import { StorageDTO } from "../../services/storage/storage-dto";

export const RequestDetail = ({
                                data,
                                attachments,
                                onUpdate
                              }: {
  attachments: StorageDTO[],
  data: any,
  onUpdate?: () => void
}) => {

  return (
    <section className="relative grid grid-cols-1 max-w-full lg:max-w-5xl items-start lg:grid-cols-2">
      <Detail data={data} attachments={attachments}  onUpdate={onUpdate}/>
      <Tag data={data} />
    </section>
  );
};
