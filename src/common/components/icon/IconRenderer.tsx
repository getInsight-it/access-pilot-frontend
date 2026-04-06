import React from "react";
import { icons, User } from "lucide-react";

type IconRendererProps = {
  iconName?: string;
  className?: string;
  showPlaceholder?: boolean;
};

const IconRenderer: React.FC<IconRendererProps> = ({ iconName, className, showPlaceholder = false }) => {
  if (!iconName || iconName.trim() === "") {
    if (showPlaceholder) {
      return <User className={className} />;
    }
    return null;
  }

  const Icon = icons[iconName as keyof typeof icons];

  if (!Icon) {
    if (showPlaceholder) {
      return <User className={className} />;
    }
    return null;
  }

  return <Icon className={className} />;
};

export default IconRenderer;
