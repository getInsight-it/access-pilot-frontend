import { motion, useAnimate } from "framer-motion";
import { useEffect, useRef, useLayoutEffect } from "react";

interface HighlightLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function HighlightLoader({ message = "Carregando...", size = "md" }: HighlightLoaderProps) {
  const [scope, animate] = useAnimate();
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useRef(0);
  const sizeClasses = {
    sm: { container: "w-16", loader: "h-12", img: "w-10" },
    md: { container: "w-24", loader: "h-16", img: "w-14" },
    lg: { container: "w-32", loader: "h-20", img: "w-16" }
  };

  useLayoutEffect(() => {
    if (containerRef.current) {
      containerWidth.current = containerRef.current.offsetWidth;
    }
  }, []);

  useEffect(() => {
    const animateLoader = async () => {
      await animate(
        [
          [scope.current, { x: -5, width: "0%" }],
          [scope.current, { x: 0, width: "100%" }, { duration: 1 }],
          [scope.current, { x: 0, width: "100%" }, { duration: 0.2 }],
          [scope.current, { x: containerWidth.current, width: "0%" }, { duration: 0.8 }],
          [scope.current, { x: -5, width: "0%" }, { duration: 0.1 }]
        ],
        {
          repeat: Infinity,
          repeatDelay: 0.3
        }
      );
    };

    animateLoader();
  }, [animate, scope, containerWidth]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        ref={containerRef}
        className={`relative ${sizeClasses[size].container} grid items-center justify-center`}
      >
        <motion.div
          ref={scope}
          className={`loader absolute ${sizeClasses[size].loader} bg-black`}
        />
        <div className="text m-4 text-white whitespace-nowrap mix-blend-difference z-10">
          <img className={sizeClasses[size].img} src="/img/ap-white.svg" alt="Logo" />
        </div>
      </div>

      <motion.div
        key="message-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="h-6 flex items-center justify-center"
      >
        {message && (
          <motion.p
            key={message}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-muted-foreground text-center"
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
