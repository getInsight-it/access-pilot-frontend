import { ReactNode } from "react";

export const CalloutChip = ({ children }: { children: ReactNode }) => {
  return (
    <span className="mb-4 inline-block w-fit rounded-full border bg-[var(--callout-chip-bg)] px-2 py-0.5 text-white text-xs font-medium uppercase">
      {children}
    </span>
  );
};
