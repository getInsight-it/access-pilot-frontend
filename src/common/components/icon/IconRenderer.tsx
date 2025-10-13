import React from "react";
import { iconsMap } from "./constant/iconsMap.ts";
import { User } from "lucide-react";

type IconRendererProps = {
  className?: string;
  showPlaceholder?: boolean;
};

const IconRenderer: React.FC<IconRendererProps> = ({ className, showPlaceholder = false }) => {
  if (!className || className.trim() === "") {
    if (showPlaceholder) {
      return <User className="w-6 h-6 text-gray-400" />;
    }
    return null;
  }

  const [iconClass, ...tailwindClasses] = className.split(" ");
  const Icon = iconsMap[iconClass] || null;

  if (!Icon) {
    if (showPlaceholder) {
      return <User className={tailwindClasses.join(" ") || "w-6 h-6 text-gray-400"} />;
    }
    return null;
  }

  return <Icon className={tailwindClasses.join(" ")} />;
};

export default IconRenderer;
