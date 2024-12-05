// IconRenderer.tsx
import React from "react";
import { iconsMap } from "./iconsMap";

type IconRendererProps = {
  className: string;
};

const IconRenderer: React.FC<IconRendererProps> = ({ className }) => {
  // Extrair o nome do ícone e as classes Tailwind
  const [iconClass, ...tailwindClasses] = className.split(" ");
  const Icon = iconsMap[iconClass] || null;

  if (!Icon) {
    console.warn(`Nenhum ícone encontrado para a classe: ${iconClass}`);
    return null;
  }

  // Renderizar o ícone com as classes Tailwind aplicadas
  return <Icon className={tailwindClasses.join(" ")} />;
};

export default IconRenderer;
