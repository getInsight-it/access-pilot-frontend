import { cn } from "../../../../config/lib/utils.ts";
import HelmetPulseLoader from "../helmet-pulse-loader/HelmetPulseLoader.tsx";
import "./section-loader.scss";

interface SectionLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  fullHeight?: boolean;
  message?: string;
}

export function SectionLoader({
  className,
  size = "lg",
  fullHeight = false,
  message
}: SectionLoaderProps) {
  return (
    <div
      className={cn(
        "section-loader",
        fullHeight && "section-loader--full-height",
        className
      )}
    >
      <HelmetPulseLoader size={size} />

      {message && <p className="section-loader__message">{message}</p>}
    </div>
  );
}
