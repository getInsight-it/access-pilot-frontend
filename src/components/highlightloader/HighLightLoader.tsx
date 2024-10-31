import { motion, useAnimate } from "framer-motion";
import { useEffect, useRef, useLayoutEffect } from "react";

export default function HighlightLoader() {
  const [scope, animate] = useAnimate();
  const containerRef = useRef<HTMLDivElement>(null); // Especifica o tipo HTMLDivElement
  const containerWidth = useRef(0);

  useLayoutEffect(() => {
    if (containerRef.current) {
      containerWidth.current = containerRef.current.offsetWidth; // Salva a largura do container
    }
  }, []);

  useEffect(() => {
    const animateLoader = async () => {
      await animate(
        [
          [scope.current, { x: 0, width: "100%" }],
          [scope.current, { x: containerWidth.current, width: "0%" }, { delay: 0.6 }]
        ],
        {
          duration: 2,
          repeat: Infinity,
          repeatDelay: 0.8
        }
      );
    };
    animateLoader();
  }, [animate, scope]);

  return (
    <div ref={containerRef} className="container relative w-32 grid items-center justify-center"> {/* Associa ref ao container */}
      <motion.div ref={scope} className="loader absolute h-32 bg-black" />
      <h1 className="text m-4 text-white whitespace-nowrap mix-blend-difference">
        <img className="w-14" src="/ap-full-w.svg" />
      </h1>
    </div>
  );
}
  
