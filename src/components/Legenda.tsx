import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Legenda: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const lights = [
    { color: 'red', text: "Sistema não gerenciado", bgColor: "bg-red-600", shadow: "shadow-[0_0_20px_5px_#c0392b]" },
    { color: 'yellow', text: "Sistema gerenciado, não publicado", bgColor: "bg-yellow-500", shadow: "shadow-[0_0_20px_5px_#f1c40f]" },
    { color: 'green', text: "Sistema gerenciado e publicado", bgColor: "bg-green-500", shadow: "shadow-[0_0_20px_5px_#2ecc71]" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % lights.length);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-4">
      <AnimatePresence mode="wait">
        <motion.span
          key={activeIndex}
          className="text-sm font-medium text-primary"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {lights[activeIndex].text}
        </motion.span>
      </AnimatePresence>
      <div className="px-2 bg-[#2f2f2f] rounded-md flex flex-row items-center justify-around h-8 w-24">
        {lights.map((light, index) => (
          <motion.div
            key={light.color}
            className={`relative h-3 w-3 rounded-full ${
              index === activeIndex ? `${light.bgColor} ${light.shadow}` : "bg-black/30"
            } before:absolute before:top-[0px] before:left-0 before:w-[12px] before:h-[12px] before:rounded-full before:border-r-4 before:border-white/60`}
            animate={{ scale: index === activeIndex ? 1 : 0.8, opacity: index === activeIndex ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
      
    </div>
  );
};

export default Legenda;

