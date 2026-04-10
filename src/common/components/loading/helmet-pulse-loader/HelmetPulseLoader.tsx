import { cn } from "../../../../config/lib/utils.ts";
import { useTheme } from "@theme/theme-provider.tsx";
import "./helmet-pulse-loader.scss";

interface HelmetPulseLoaderProps {
  size?: "sm" | "md" | "lg";
}

export default function HelmetPulseLoader({ size = "md" }: HelmetPulseLoaderProps) {
  const { themeType } = useTheme();
  const isDarkTheme = themeType === "dark";

  return (
    <div
      className={cn(
        "helmet-pulse-loader",
        `helmet-pulse-loader--${size}`,
        isDarkTheme && "helmet-pulse-loader--dark",
      )}
    >
      <div className="helmet-pulse-loader__shell" aria-hidden="true">
        {isDarkTheme ? (
          <div className="helmet-pulse-loader__crop">
            <img
              className="helmet-pulse-loader__image helmet-pulse-loader__image--dark"
              src="/img/accesspilot-w.svg"
              alt="Capacete AccessPilot"
            />
          </div>
        ) : (
          <img
            className="helmet-pulse-loader__image"
            src="/avatars/helmet-placeholder.svg"
            alt="Capacete AccessPilot"
          />
        )}
      </div>
    </div>
  );
}
