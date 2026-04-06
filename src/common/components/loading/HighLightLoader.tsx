import { motion } from "framer-motion";
import { cn } from "../../../config/lib/utils.ts";
import "./high-light-loader.scss";

interface HighlightLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function HighlightLoader({ message, size = "md" }: HighlightLoaderProps) {
  return (
    <div className={cn("highlight-loader", `highlight-loader--${size}`)}>
      <div className="highlight-loader__track">
        <div className="highlight-loader__track-glow" />
        <motion.div
          className="highlight-loader__bar"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: [0, 1] }}
          transition={{
            duration: 1.8,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 0.25
          }}
        />
        <motion.div
          className="highlight-loader__logo"
          initial={{ opacity: 0.84, scale: 0.98 }}
          animate={{ opacity: [0.84, 1, 0.84], scale: [0.98, 1.0, 0.98], y: ["0%", "-5%", "0%"] }}
          transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
        >
          <img className="highlight-loader__logo-image" src="/img/accesspilot-logo.svg" alt="AccessPilot logo" />
        </motion.div>
      </div>

      {message && (
        <motion.div
          key="message-container"
          className="highlight-loader__message-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.p
            key={message}
            className="highlight-loader__message"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {message}
          </motion.p>
        </motion.div>
      )}
    </div>
  );
}
