import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../external/ui/card.tsx";

interface AutoHeightProps {
  children: React.ReactNode;
  className?: string;
  transitionDuration?: number;
}

export function AutoHeight({
  children,
  transitionDuration = 0.4
}: AutoHeightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if(!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      setHeight(entries[0].contentRect.height);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [children]);

  return (
    <motion.div
      className="box-border border border-gray-300 rounded-xl bg-secondary"
      style={{ boxSizing: "border-box", overflow: "hidden", height }}
      animate={{ height }}
      transition={{ duration: transitionDuration, ease: "easeInOut" }}>
      <div ref={containerRef}>
        <Card className="border-none bg-secondary">{children}</Card>
      </div>
    </motion.div>
  );
}
