import React, { CSSProperties } from "react";
import { icons, User } from "lucide-react";

type IconRendererProps = {
  iconName?: string;
  className?: string;
  showPlaceholder?: boolean;
  color?: string | null;
};

const IconRenderer: React.FC<IconRendererProps> = ({ iconName, className, showPlaceholder = false, color }) => {
  const iconStyle = color ? ({ color } as CSSProperties) : undefined;

  if (!iconName || iconName.trim() === "") {
    if (showPlaceholder) {
      return <User className={className} style={iconStyle} />;
    }
    return null;
  }

  const Icon = icons[iconName as keyof typeof icons];

  if (!Icon) {
    if (showPlaceholder) {
      return <User className={className} style={iconStyle} />;
    }
    return null;
  }

  return <Icon className={className} style={iconStyle} />;
};

export default IconRenderer;
