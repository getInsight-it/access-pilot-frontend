import React from "react";
import { iconsMap } from "./constant/iconsMap.ts";

type IconRendererProps = {
  className: string;
};

const IconRenderer: React.FC<IconRendererProps> = ({ className }) => {
  const [iconClass, ...tailwindClasses] = className.split(" ");
  const Icon = iconsMap[iconClass] || null;

  if (!Icon) {
    console.warn(`Nenhum ícone encontrado para a classe: ${iconClass}`);
    return null;
  }

  return <Icon className={tailwindClasses.join(" ")} />;
};

export default IconRenderer;
